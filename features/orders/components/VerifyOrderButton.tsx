"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { verifyOrder } from "../actions";

export function VerifyOrderButton({
  orderId,
  onVerified,
}: {
  orderId: string;
  onVerified: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setError(null);
    setIsPending(true);
    const result = await verifyOrder({ orderId });
    setIsPending(false);
    if (!result.success) {
      setError(result.formError ?? "Could not verify order.");
      return;
    }
    onVerified();
  }

  return (
    <div className="flex flex-col gap-1">
      <Button size="sm" disabled={isPending} onClick={handleVerify}>
        {isPending ? "Verifying..." : "Verify payment"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
