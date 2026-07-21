import { createClient } from "@/lib/supabase/server";
import type { ServiceType } from "@/features/catalog/schema";
import { deriveOrderCode, type OrderStatus } from "./schema";

export type OrderListRow = {
  id: string;
  orderCode: string;
  serviceType: ServiceType;
  status: OrderStatus;
  itemName: string;
  variantLabel: string;
  price: number;
  senderAccountName: string;
  customerWhatsappNumber: string;
  createdAt: string;
};

export type OrderCounts = Record<OrderStatus, number>;

export type OrderDetail = {
  id: string;
  orderCode: string;
  serviceType: ServiceType;
  status: OrderStatus;
  itemName: string;
  variantLabel: string;
  price: number;
  senderAccountName: string;
  customerWhatsappNumber: string;
  paymentProofSignedUrl: string | null;
  completionProofSignedUrl: string | null;
  credentialStatus: "stored" | "purged" | null; // null for giftcard orders
  cancellationReason: string | null;
  createdAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
};

export type ListOrdersFilters = {
  statuses?: OrderStatus[];
  serviceType?: ServiceType | "all";
  search?: string;
};

const ORDER_LIST_SELECT =
  "id, service_type, status, catalog_item_name, catalog_variant_label, price, sender_account_name, customer_whatsapp_number, created_at";

function mapListRow(row: {
  id: string;
  service_type: string;
  status: string;
  catalog_item_name: string;
  catalog_variant_label: string;
  price: number;
  sender_account_name: string;
  customer_whatsapp_number: string;
  created_at: string;
}): OrderListRow {
  return {
    id: row.id,
    orderCode: deriveOrderCode(row.id),
    serviceType: row.service_type as ServiceType,
    status: row.status as OrderStatus,
    itemName: row.catalog_item_name,
    variantLabel: row.catalog_variant_label,
    price: row.price,
    senderAccountName: row.sender_account_name,
    customerWhatsappNumber: row.customer_whatsapp_number,
    createdAt: row.created_at,
  };
}

export async function listOrders(
  filters: ListOrdersFilters = {},
): Promise<OrderListRow[]> {
  if (filters.statuses && filters.statuses.length === 0) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(ORDER_LIST_SELECT)
    .order("created_at", { ascending: false });

  if (filters.statuses && filters.statuses.length > 0) {
    query = query.in("status", filters.statuses);
  }

  if (filters.serviceType && filters.serviceType !== "all") {
    query = query.eq("service_type", filters.serviceType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listOrders error:", error.code, error.message);
    throw new Error("Failed to load orders.");
  }

  const rows = (data ?? []).map(mapListRow);

  const term = filters.search?.trim().toLowerCase();
  if (!term) {
    return rows;
  }

  const codeTerm = term.replace(/^qs-/i, "");

  return rows.filter(
    (row) =>
      row.senderAccountName.toLowerCase().includes(term) ||
      row.customerWhatsappNumber.toLowerCase().includes(term) ||
      row.orderCode.toLowerCase().replace(/^qs-/, "").includes(codeTerm),
  );
}

export async function getOrderCounts(): Promise<OrderCounts> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("orders").select("status");

  if (error) {
    console.error("getOrderCounts error:", error.code, error.message);
    throw new Error("Failed to load order counts.");
  }

  const counts: OrderCounts = {
    payment_submitted: 0,
    verified: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const row of data ?? []) {
    const status = row.status as OrderStatus;
    counts[status] += 1;
  }

  return counts;
}

const SIGNED_URL_EXPIRY_SECONDS = 300;

async function signProofUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string | null,
): Promise<string | null> {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from("order-proofs")
    .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) {
    console.error("signProofUrl error:", error?.message);
    return null;
  }

  return data.signedUrl;
}

function getCredentialStatus(order: {
  service_type: string;
  game_account_email_enc: string | null;
  credentials_purge_at: string | null;
}): "stored" | "purged" | null {
  if (order.service_type !== "gaming") return null;

  if (!order.game_account_email_enc) return "purged";

  if (
    order.credentials_purge_at &&
    new Date(order.credentials_purge_at) <= new Date()
  ) {
    return "purged";
  }

  return "stored";
}

export async function getOrderById(
  orderId: string,
): Promise<OrderDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, service_type, status, catalog_item_name, catalog_variant_label, price, sender_account_name, customer_whatsapp_number, payment_proof_url, completion_proof_url, game_account_email_enc, credentials_purge_at, cancellation_reason, created_at, completed_at, cancelled_at",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("getOrderById error:", error.code, error.message);
    throw new Error("Failed to load order.");
  }

  if (!data) return null;

  const [paymentProofSignedUrl, completionProofSignedUrl] = await Promise.all([
    signProofUrl(supabase, data.payment_proof_url),
    signProofUrl(supabase, data.completion_proof_url),
  ]);

  return {
    id: data.id,
    orderCode: deriveOrderCode(data.id),
    serviceType: data.service_type as ServiceType,
    status: data.status as OrderStatus,
    itemName: data.catalog_item_name,
    variantLabel: data.catalog_variant_label,
    price: data.price,
    senderAccountName: data.sender_account_name,
    customerWhatsappNumber: data.customer_whatsapp_number,
    paymentProofSignedUrl,
    completionProofSignedUrl,
    credentialStatus: getCredentialStatus(data),
    cancellationReason: data.cancellation_reason,
    createdAt: data.created_at,
    completedAt: data.completed_at,
    cancelledAt: data.cancelled_at,
  };
}
