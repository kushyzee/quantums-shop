"use client";

import { useRouter } from "next/navigation";
import { ORDER_ACTIONS_BY_STATUS } from "../schema";
import type { OrderDetail } from "../queries";
import { VerifyOrderButton } from "./VerifyOrderButton";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { CompleteOrderButton } from "./CompleteOrderButton";
import { MessageCustomerButton } from "./MessageCustomerButton";

export function OrderActionToolbar({ order }: { order: OrderDetail }) {
  const router = useRouter();
  const availableActions = ORDER_ACTIONS_BY_STATUS[order.status];

  function handleChanged() {
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <MessageCustomerButton order={order} />

      {availableActions.includes("verify") && (
        <VerifyOrderButton orderId={order.id} onVerified={handleChanged} />
      )}
      {availableActions.includes("complete") && (
        <CompleteOrderButton orderId={order.id} onCompleted={handleChanged} />
      )}
      {availableActions.includes("cancel") && (
        <CancelOrderDialog orderId={order.id} onCancelled={handleChanged} />
      )}
    </div>
  );
}
