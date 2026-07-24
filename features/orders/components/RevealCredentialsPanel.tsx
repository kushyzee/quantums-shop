"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { revealCredentials } from "../actions";

type Credentials = {
  email: string;
  password: string;
};

export function RevealCredentialsPanel({
  orderId,
  credentialStatus,
}: {
  orderId: string;
  credentialStatus: "stored" | "purged";
}) {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (credentialStatus === "purged") {
    return <Badge variant="secondary">Credentials purged</Badge>;
  }

  if (credentials) {
    return (
      <div className="flex flex-col gap-1 rounded-md border border-border bg-muted/30 p-3">
        <span className="text-sm">
          <span className="text-muted-foreground">Email: </span>
          {credentials.email}
        </span>
        <span className="text-sm">
          <span className="text-muted-foreground">Password: </span>
          {credentials.password}
        </span>
      </div>
    );
  }

  async function handleReveal() {
    setError(null);
    setIsRevealing(true);
    const result = await revealCredentials({ orderId });
    setIsRevealing(false);
    if (!result.success) {
      setError(result.formError ?? "Could not reveal credentials.");
      return;
    }
    setCredentials(result.data);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Credentials stored</Badge>
        <Button
          size="sm"
          variant="outline"
          disabled={isRevealing}
          onClick={handleReveal}
        >
          {isRevealing ? "Revealing..." : "Reveal"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
