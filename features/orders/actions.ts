"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getVariantForOrder } from "@/features/catalog/queries";
import { createOrderSchema, proofImageSchema, deriveOrderCode } from "./schema";

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
          "That payment proof image couldn't be used — please try a different file.",
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

  return {
    success: true,
    data: {
      orderId,
      orderCode: deriveOrderCode(orderId),
    },
  };
}
