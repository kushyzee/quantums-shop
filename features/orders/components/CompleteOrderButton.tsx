"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { completeOrder } from "../actions";

export function CompleteOrderButton({
  orderId,
  onCompleted,
}: {
  orderId: string;
  onCompleted: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete() {
    setError(null);
    setIsPending(true);
    const result = await completeOrder({ orderId });
    setIsPending(false);
    if (!result.success) {
      setError(result.formError ?? "Could not complete order.");
      return;
    }
    onCompleted();
  }

  return (
    <div className="flex flex-col gap-1">
      <Button size="sm" disabled={isPending} onClick={handleComplete}>
        {isPending ? "Completing..." : "Mark as completed"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
