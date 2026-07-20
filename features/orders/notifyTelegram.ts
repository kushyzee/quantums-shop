import { formatNaira } from "@/lib/currency";

type NewOrderNotification = {
  orderId: string;
  orderCode: string;
  serviceType: "gaming" | "giftcard";
  itemName: string;
  variantLabel: string;
  price: number;
  senderAccountName: string;
};

const SERVICE_LABELS: Record<NewOrderNotification["serviceType"], string> = {
  gaming: "Gaming Top-up",
  giftcard: "Gift Card",
};

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (char) => `\\${char}`);
}

export async function notifyNewOrder(
  order: NewOrderNotification,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!token || !chatId || !siteUrl) {
    console.error(
      "notifyNewOrder: missing TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, or NEXT_PUBLIC_SITE_URL env var, skipping notification",
    );
    return;
  }

  const orderUrl = `${siteUrl}/admin/orders/${order.orderId}`;

  const text = [
    `🛒 *New Order: ${escapeMarkdown(order.orderCode)}*`,
    ``,
    `*Service:* ${escapeMarkdown(SERVICE_LABELS[order.serviceType])}`,
    `*Item:* ${escapeMarkdown(order.itemName)} ${escapeMarkdown(order.variantLabel)}`,
    `*Price:* ${escapeMarkdown(formatNaira(order.price))}`,
    `*Sender:* ${escapeMarkdown(order.senderAccountName)}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [[{ text: "View Order", url: orderUrl }]],
          },
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(
        "notifyNewOrder: Telegram API error",
        response.status,
        body,
      );
    }
  } catch (err) {
    console.error("notifyNewOrder: failed to reach Telegram API", err);
  }
}
