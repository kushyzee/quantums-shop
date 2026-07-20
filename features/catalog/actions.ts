"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createItemSchema,
  updateItemSchema,
  toggleItemActiveSchema,
  createVariantSchema,
  updateVariantSchema,
  toggleVariantActiveSchema,
} from "./schema";

type ActionResult<TData = undefined> =
  | { success: true; data: TData }
  | {
      success: false;
      fieldErrors?: Record<string, string[] | undefined>;
      formError?: string;
    };

export async function createItem(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createItemSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        name: tree.properties?.name?.errors,
        serviceType: tree.properties?.serviceType?.errors,
      },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_items")
    .insert({
      name: parsed.data.name,
      service_type: parsed.data.serviceType,
      active: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createItem error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/catalog");
  return { success: true, data: { id: data.id } };
}

export async function updateItem(input: unknown): Promise<ActionResult> {
  const parsed = updateItemSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: { name: tree.properties?.name?.errors },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("catalog_items")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("updateItem error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/catalog");
  revalidatePath(`/admin/catalog/${parsed.data.id}`);
  return { success: true, data: undefined };
}

export async function toggleItemActive(input: unknown): Promise<ActionResult> {
  const parsed = toggleItemActiveSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("catalog_items")
    .update({ active: parsed.data.active })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("toggleItemActive error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/catalog");
  revalidatePath(`/admin/catalog/${parsed.data.id}`);
  return { success: true, data: undefined };
}

export async function createVariant(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createVariantSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        label: tree.properties?.label?.errors,
        price: tree.properties?.price?.errors,
      },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_variants")
    .insert({
      item_id: parsed.data.itemId,
      label: parsed.data.label,
      price: parsed.data.price,
      active: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createVariant error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath(`/admin/catalog/${parsed.data.itemId}`);
  return { success: true, data: { id: data.id } };
}

export async function updateVariant(input: unknown): Promise<ActionResult> {
  const parsed = updateVariantSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        label: tree.properties?.label?.errors,
        price: tree.properties?.price?.errors,
      },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_variants")
    .update({ label: parsed.data.label, price: parsed.data.price })
    .eq("id", parsed.data.id)
    .select("item_id")
    .single();

  if (error) {
    console.error("updateVariant error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath(`/admin/catalog/${data.item_id}`);
  return { success: true, data: undefined };
}

export async function toggleVariantActive(
  input: unknown,
): Promise<ActionResult> {
  const parsed = toggleVariantActiveSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_variants")
    .update({ active: parsed.data.active })
    .eq("id", parsed.data.id)
    .select("item_id")
    .single();

  if (error) {
    console.error("toggleVariantActive error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath(`/admin/catalog/${data.item_id}`);
  return { success: true, data: undefined };
}
