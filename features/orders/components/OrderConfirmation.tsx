"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsappUrl } from "@/lib/utils";
import { formatNaira } from "@/lib/currency";

type OrderConfirmationProps = {
  orderCode: string;
  itemName: string;
  variantLabel: string;
  price: number;
  senderAccountName: string;
};

export function OrderConfirmation({
  orderCode,
  itemName,
  variantLabel,
  price,
  senderAccountName,
}: OrderConfirmationProps) {
  const message = `Hi, I just placed an order.\nOrder code: ${orderCode}\nItem: ${itemName} - ${variantLabel}\nSender name: ${senderAccountName}`;
  const whatsappUrl = getWhatsappUrl(message);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-lg border border-border bg-card p-6 text-center">
      <div>
        <p className="text-sm text-muted-foreground">Order submitted</p>
        <p className="mt-1 text-2xl font-semibold tracking-wide">{orderCode}</p>
      </div>

      <div className="rounded-md bg-secondary px-4 py-3 text-left text-sm">
        <p className="font-medium">
          {itemName}: {variantLabel}
        </p>
        <p className="text-muted-foreground">{formatNaira(price)}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        We&rsquo;ll reach out to you on WhatsApp once your order is completed.
        If you&rsquo;d like to follow up sooner, quote your order code or just
        message us now and we&rsquo;ll already have your details.
      </p>

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button size="lg" className="w-full">
          <MessageCircle /> Message us now
        </Button>
      </a>
    </div>
  );
}
