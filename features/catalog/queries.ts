import { createClient } from "@/lib/supabase/server";
import type { ServiceType } from "./schema";

export type CatalogItemListRow = {
  id: string;
  name: string;
  serviceType: ServiceType;
  active: boolean;
  variantCount: number;
  createdAt: string;
};

export type CatalogVariantRow = {
  id: string;
  label: string;
  price: number;
  active: boolean;
  createdAt: string;
};

export type CatalogItemWithVariants = {
  id: string;
  name: string;
  serviceType: ServiceType;
  active: boolean;
  variants: CatalogVariantRow[];
};

export async function listCatalogAdmin(): Promise<CatalogItemListRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("catalog_items")
    .select(
      `
      id,
      name,
      service_type,
      active,
      created_at,
      catalog_variants ( count )
    `,
    )
    .order("service_type", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("listCatalogAdmin error:", error.code, error.message);
    throw new Error("Failed to load catalog items.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    serviceType: row.service_type as ServiceType,
    active: row.active,
    variantCount: row.catalog_variants?.[0]?.count ?? 0,
    createdAt: row.created_at,
  }));
}

export async function getItemWithVariants(
  itemId: string,
): Promise<CatalogItemWithVariants | null> {
  const supabase = await createClient();

  const { data: item, error: itemError } = await supabase
    .from("catalog_items")
    .select("id, name, service_type, active")
    .eq("id", itemId)
    .maybeSingle();

  if (itemError) {
    console.error(
      "getItemWithVariants item error:",
      itemError.code,
      itemError.message,
    );
    throw new Error("Failed to load catalog item.");
  }

  if (!item) {
    return null;
  }

  const { data: variants, error: variantsError } = await supabase
    .from("catalog_variants")
    .select("id, label, price, active, created_at")
    .eq("item_id", itemId)
    .order("price", { ascending: true });

  if (variantsError) {
    console.error(
      "getItemWithVariants variants error:",
      variantsError.code,
      variantsError.message,
    );
    throw new Error("Failed to load variants.");
  }

  return {
    id: item.id,
    name: item.name,
    serviceType: item.service_type as ServiceType,
    active: item.active,
    variants: (variants ?? []).map((v) => ({
      id: v.id,
      label: v.label,
      price: v.price,
      active: v.active,
      createdAt: v.created_at,
    })),
  };
}
