"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsappUrlForNumber } from "@/lib/utils";
import { buildCustomerWhatsappMessage } from "../customerWhatsappMessage";
import type { OrderDetail } from "../queries";

export function MessageCustomerButton({ order }: { order: OrderDetail }) {
  const message = buildCustomerWhatsappMessage(order);
  const whatsappUrl = getWhatsappUrlForNumber(
    order.customerWhatsappNumber,
    message,
  );

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button size="sm" variant="outline">
        <MessageCircle /> Message customer
      </Button>
    </a>
  );
}
