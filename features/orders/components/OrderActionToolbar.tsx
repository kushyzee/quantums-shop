"use client";

import { useRouter } from "next/navigation";
import { ORDER_ACTIONS_BY_STATUS, type OrderStatus } from "../schema";
import { VerifyOrderButton } from "./VerifyOrderButton";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { CompleteOrderForm } from "./CompleteOrderForm";

export function OrderActionToolbar({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const availableActions = ORDER_ACTIONS_BY_STATUS[status];

  if (availableActions.length === 0) {
    return null;
  }

  function handleChanged() {
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {availableActions.includes("verify") && (
        <VerifyOrderButton orderId={orderId} onVerified={handleChanged} />
      )}
      {availableActions.includes("complete") && (
        <CompleteOrderForm orderId={orderId} onCompleted={handleChanged} />
      )}
      {availableActions.includes("cancel") && (
        <CancelOrderDialog orderId={orderId} onCancelled={handleChanged} />
      )}
    </div>
  );
}
