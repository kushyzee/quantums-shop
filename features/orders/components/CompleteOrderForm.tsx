"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MAX_PROOF_IMAGE_SIZE_BYTES,
  MAX_PROOF_IMAGE_SIZE_MB,
  ACCEPTED_PROOF_IMAGE_TYPES,
} from "../schema";
import { compressProofImage } from "../compressProofImage";
import { completeOrder } from "../actions";

export function CompleteOrderForm({
  orderId,
  onCompleted,
}: {
  orderId: string;
  onCompleted: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    if (
      !(ACCEPTED_PROOF_IMAGE_TYPES as readonly string[]).includes(selected.type)
    ) {
      setError("Only JPG, PNG, or WEBP images are accepted.");
      return;
    }

    setError(null);
    setIsCompressing(true);
    try {
      const compressed = await compressProofImage(
        selected,
        MAX_PROOF_IMAGE_SIZE_BYTES,
      );
      setFile(compressed);
    } catch {
      setError("Couldn't process that image. Please try a different one.");
    } finally {
      setIsCompressing(false);
    }
  }

  async function handleSubmit() {
    if (!file) {
      setError("Attach a completion proof image before completing this order.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = await completeOrder(orderId, file);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.formError ?? "Could not complete order.");
      return;
    }

    onCompleted();
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <p className="text-sm font-medium">Complete this order</p>
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isCompressing || isSubmitting}
      />
      <p className="text-sm text-muted-foreground">
        Completion proof is required. JPG, PNG, or WEBP, large images are
        resized automatically, up to {MAX_PROOF_IMAGE_SIZE_MB}MB.
      </p>
      {isCompressing && (
        <p className="text-sm text-muted-foreground">Processing image…</p>
      )}
      {file && !isCompressing && (
        <p className="text-sm text-foreground">Attached: {file.name}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        size="sm"
        disabled={isSubmitting || isCompressing}
        onClick={handleSubmit}
        className="w-fit"
      >
        {isSubmitting ? "Completing..." : "Mark as completed"}
      </Button>
    </div>
  );
}
