import type { OrderStatus } from "./schema";

type OrderForCustomerMessage = {
  orderCode: string;
  itemName: string;
  variantLabel: string;
  status: OrderStatus;
  cancellationReason: string | null;
};

export function buildCustomerWhatsappMessage(
  order: OrderForCustomerMessage,
): string {
  const itemLine = `${order.itemName} - ${order.variantLabel}`;

  switch (order.status) {
    case "payment_submitted":
      return `Hi! This is Quantum's Shop, confirming we've received your order ${order.orderCode} (${itemLine}). We're reviewing your payment now.`;
    case "verified":
      return `Hi! Your order ${order.orderCode} (${itemLine}) has been verified and we're processing it now.`;
    case "completed":
      return `Hi! Your order ${order.orderCode} (${itemLine}) has been completed. Thank you for your business!`;
    case "cancelled":
      return `Hi! Unfortunately your order ${order.orderCode} (${itemLine}) has been cancelled. Reason: ${
        order.cancellationReason ?? "Not specified"
      }`;
  }
}
