"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getVariantForOrder } from "@/features/catalog/queries";
import {
  createOrderSchema,
  proofImageSchema,
  orderIdSchema,
  cancelOrderSchema,
  ORDER_ACTIONS_BY_STATUS,
  deriveOrderCode,
  type OrderStatus,
} from "./schema";
import { notifyNewOrder } from "./notifyTelegram";

type ActionResult<TData = undefined> =
  | { success: true; data: TData }
  | {
      success: false;
      fieldErrors?: Record<string, string[] | undefined>;
      formError?: string;
    };

type CreateOrderData = {
  orderId: string;
  orderCode: string;
};

export async function createOrder(
  input: unknown,
  proofFile?: File | null,
): Promise<ActionResult<CreateOrderData>> {
  const parsed = createOrderSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    const properties = (tree.properties ?? {}) as Record<
      string,
      { errors?: string[] } | undefined
    >;
    return {
      success: false,
      fieldErrors: {
        catalogVariantId: properties.catalogVariantId?.errors,
        senderAccountName: properties.senderAccountName?.errors,
        customerWhatsappNumber: properties.customerWhatsappNumber?.errors,
        gameAccountEmail: properties.gameAccountEmail?.errors,
        gameAccountPassword: properties.gameAccountPassword?.errors,
        accountAccessConsent: properties.accountAccessConsent?.errors,
      },
    };
  }

  const order = parsed.data;

  if (proofFile) {
    const proofParsed = proofImageSchema.safeParse(proofFile);
    if (!proofParsed.success) {
      return {
        success: false,
        formError:
          "That payment proof image couldn't be used, please try a different file.",
      };
    }
  }

  const variant = await getVariantForOrder(order.catalogVariantId);

  if (!variant || variant.serviceType !== order.serviceType) {
    return {
      success: false,
      formError:
        "That item is no longer available. Please go back and choose another.",
    };
  }

  const supabase = await createClient();
  const orderId = crypto.randomUUID();

  let paymentProofPath: string | null = null;
  if (proofFile) {
    const path = `payment/${orderId}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("order-proofs")
      .upload(path, proofFile, { contentType: "image/jpeg" });

    if (uploadError) {
      console.error("createOrder proof upload error:", uploadError.message);
    } else {
      paymentProofPath = path;
    }
  }

  let gameAccountEmailEnc: string | null = null;
  let gameAccountPasswordEnc: string | null = null;

  if (order.serviceType === "gaming") {
    const { data: encrypted, error: encryptError } = await supabase
      .rpc("encrypt_game_credentials", {
        p_email: order.gameAccountEmail,
        p_password: order.gameAccountPassword,
      })
      .single();

    if (encryptError || !encrypted) {
      console.error(
        "createOrder encrypt_game_credentials error:",
        encryptError?.message,
      );
      return {
        success: false,
        formError: "Something went wrong. Please try again.",
      };
    }

    gameAccountEmailEnc = encrypted.email_enc;
    gameAccountPasswordEnc = encrypted.password_enc;
  }

  const { error: insertError } = await supabase.from("orders").insert({
    id: orderId,
    service_type: order.serviceType,
    catalog_item_name: variant.itemName,
    catalog_variant_label: variant.variantLabel,
    price: variant.price,
    catalog_variant_id: order.catalogVariantId,
    sender_account_name: order.senderAccountName,
    customer_whatsapp_number: order.customerWhatsappNumber,
    payment_proof_url: paymentProofPath,
    game_account_email_enc: gameAccountEmailEnc,
    game_account_password_enc: gameAccountPasswordEnc,
  });

  if (insertError) {
    console.error(
      "createOrder insert error:",
      insertError.code,
      insertError.message,
    );
    return {
      success: false,
      formError:
        "Something went wrong submitting your order. Please try again.",
    };
  }

  const orderCode = deriveOrderCode(orderId);

  void notifyNewOrder({
    orderId,
    orderCode,
    serviceType: order.serviceType,
    itemName: variant.itemName,
    variantLabel: variant.variantLabel,
    price: variant.price,
    senderAccountName: order.senderAccountName,
  });

  return {
    success: true,
    data: {
      orderId,
      orderCode,
    },
  };
}

// ---------------------------------------------------------------------------
// M7 — Fulfillment actions
// ---------------------------------------------------------------------------

function revalidateOrderPaths(orderId: string) {
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function verifyOrder(input: unknown): Promise<ActionResult> {
  const parsed = orderIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }
  const { orderId } = parsed.data;

  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    console.error(
      "verifyOrder fetch error:",
      fetchError?.code,
      fetchError?.message,
    );
    return { success: false, formError: "Order not found." };
  }

  if (
    !ORDER_ACTIONS_BY_STATUS[order.status as OrderStatus].includes("verify")
  ) {
    return {
      success: false,
      formError: "This order can no longer be verified.",
    };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "verified" })
    .eq("id", orderId);

  if (error) {
    console.error("verifyOrder update error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidateOrderPaths(orderId);
  return { success: true, data: undefined };
}

type RevealCredentialsData = {
  email: string;
  password: string;
};

export async function revealCredentials(
  input: unknown,
): Promise<ActionResult<RevealCredentialsData>> {
  const parsed = orderIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }
  const { orderId } = parsed.data;

  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("service_type, game_account_email_enc, credentials_purge_at")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    console.error(
      "revealCredentials fetch error:",
      fetchError?.code,
      fetchError?.message,
    );
    return { success: false, formError: "Order not found." };
  }

  const purged =
    order.service_type !== "gaming" ||
    !order.game_account_email_enc ||
    (order.credentials_purge_at !== null &&
      new Date(order.credentials_purge_at) <= new Date());

  if (purged) {
    return {
      success: false,
      formError: "These credentials are no longer available.",
    };
  }

  const { data: decrypted, error: decryptError } = await supabase
    .rpc("decrypt_game_credentials", { p_order_id: orderId })
    .single();

  if (decryptError || !decrypted) {
    console.error(
      "revealCredentials decrypt_game_credentials error:",
      decryptError?.message,
    );
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  const { error: logError } = await supabase
    .from("credential_access_log")
    .insert({ order_id: orderId });

  if (logError) {
    console.error(
      "revealCredentials credential_access_log error:",
      logError.code,
      logError.message,
    );
  }

  return {
    success: true,
    data: { email: decrypted.email, password: decrypted.password },
  };
}

const COMPLETION_CREDENTIALS_PURGE_HOURS = 48;

export async function completeOrder(input: unknown): Promise<ActionResult> {
  const parsed = orderIdSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }
  const { orderId } = parsed.data;

  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    console.error(
      "completeOrder fetch error:",
      fetchError?.code,
      fetchError?.message,
    );
    return { success: false, formError: "Order not found." };
  }

  if (
    !ORDER_ACTIONS_BY_STATUS[order.status as OrderStatus].includes("complete")
  ) {
    return {
      success: false,
      formError: "This order can no longer be completed.",
    };
  }

  const completedAt = new Date();
  const purgeAt = new Date(
    completedAt.getTime() + COMPLETION_CREDENTIALS_PURGE_HOURS * 60 * 60 * 1000,
  );

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "completed",
      completed_at: completedAt.toISOString(),
      credentials_purge_at: purgeAt.toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    console.error(
      "completeOrder update error:",
      updateError.code,
      updateError.message,
    );
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidateOrderPaths(orderId);
  return { success: true, data: undefined };
}

export async function cancelOrder(input: unknown): Promise<ActionResult> {
  const parsed = cancelOrderSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        cancellationReason: tree.properties?.cancellationReason?.errors,
      },
    };
  }

  const { orderId, cancellationReason } = parsed.data;
  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError || !order) {
    console.error(
      "cancelOrder fetch error:",
      fetchError?.code,
      fetchError?.message,
    );
    return { success: false, formError: "Order not found." };
  }

  if (
    !ORDER_ACTIONS_BY_STATUS[order.status as OrderStatus].includes("cancel")
  ) {
    return {
      success: false,
      formError: "This order can no longer be cancelled.",
    };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      cancellation_reason: cancellationReason,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("cancelOrder update error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidateOrderPaths(orderId);
  return { success: true, data: undefined };
}
