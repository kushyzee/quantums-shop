"use client";

import { useState } from "react";
import { useSelector } from "@tanstack/react-form";
import { Copy, Check } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BankAccountRow } from "@/features/settings/queries";
import type { ServiceType } from "@/features/catalog/schema";
import {
  MAX_PROOF_IMAGE_SIZE_BYTES,
  MAX_PROOF_IMAGE_SIZE_MB,
  ACCEPTED_PROOF_IMAGE_TYPES,
} from "../schema";
import { compressProofImage } from "../compressProofImage";
import { AccountAccessConsent } from "./AccountAccessConsent";
import type { OrderForm } from "./OrderWizard";

type FieldErrorItem = { message?: string } | string | undefined;

function normalizeErrors(errors: FieldErrorItem[]) {
  return errors.map((e) => (typeof e === "string" ? { message: e } : e));
}

type CustomerInfoStepProps = {
  form: OrderForm;
  serviceType: ServiceType;
  bankAccounts: BankAccountRow[];
  onBack: () => void;
};

function getFileSizeLabel(size: number): string {
  const fileSizeInMB = (size / 1024 / 1024).toFixed(2);
  if (Number(fileSizeInMB) < 1) {
    return (size / 1024).toFixed(2) + "KB";
  }
  return fileSizeInMB + "MB";
}

export function CustomerInfoStep({
  form,
  serviceType,
  bankAccounts,
  onBack,
}: CustomerInfoStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <BankAccountsCard bankAccounts={bankAccounts} />

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <FieldGroup>
          <form.Field name="senderAccountName">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="sender-account-name">
                    Name on the sending account
                  </FieldLabel>
                  <Input
                    id="sender-account-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Chinedu Okafor"
                  />
                  {isInvalid && (
                    <FieldError
                      errors={normalizeErrors(field.state.meta.errors)}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="customerWhatsappNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor="customer-whatsapp">
                    Your WhatsApp number
                  </FieldLabel>
                  <Input
                    id="customer-whatsapp"
                    type="tel"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="+234 801 234 5678"
                  />
                  <p className="text-sm text-muted-foreground">
                    Include your country code, we&rsquo;ll use this to reach you
                    about your order.
                  </p>
                  {isInvalid && (
                    <FieldError
                      errors={normalizeErrors(field.state.meta.errors)}
                    />
                  )}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        {serviceType === "gaming" && <AccountAccessConsent form={form} />}

        <ProofUploadField form={form} />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm text-primary underline underline-offset-4"
          onClick={onBack}
        >
          ← Back
        </button>

        <form.Subscribe
          selector={(state: { isSubmitting: boolean }) => state.isSubmitting}
        >
          {(isSubmitting: boolean) => (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit()}
            >
              {isSubmitting ? "Submitting…" : "Submit order"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}

function BankAccountsCard({
  bankAccounts,
}: {
  bankAccounts: BankAccountRow[];
}) {
  if (bankAccounts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Bank details aren&rsquo;t available right now, please reach out on
        WhatsApp to complete your payment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6">
      <p className="text-sm font-medium">
        Transfer to one of the accounts below
      </p>
      {bankAccounts.map((account) => (
        <div
          key={account.id}
          className="rounded-md bg-secondary px-4 py-3 text-sm"
        >
          <p className="font-medium">{account.bankName}</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground">{account.accountNumber}</p>
            <CopyAccountNumberButton accountNumber={account.accountNumber} />
          </div>
          <p className="text-muted-foreground">{account.accountName}</p>
        </div>
      ))}
    </div>
  );
}

function CopyAccountNumberButton({ accountNumber }: { accountNumber: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:underline"
      aria-label={`Copy account number ${accountNumber}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}

function ProofUploadField({ form }: { form: OrderForm }) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const proofFile = useSelector(
    form.store,
    (s: { values: { paymentProofFile: File | null } }) =>
      s.values.paymentProofFile,
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (
      !(ACCEPTED_PROOF_IMAGE_TYPES as readonly string[]).includes(file.type)
    ) {
      setError("Only JPG, PNG, or WEBP images are accepted.");
      return;
    }

    setError(null);
    setIsCompressing(true);
    try {
      const compressed = await compressProofImage(
        file,
        MAX_PROOF_IMAGE_SIZE_BYTES,
      );
      form.setFieldValue("paymentProofFile", compressed);
    } catch {
      setError("Couldn't process that image. Please try a different one.");
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor="payment-proof">
        Payment proof <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      <Input
        id="payment-proof"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isCompressing}
      />
      <p className="text-sm text-muted-foreground">
        JPG, PNG, or WEBP, large images are resized automatically, up to{" "}
        {MAX_PROOF_IMAGE_SIZE_MB}MB.
      </p>
      {isCompressing && (
        <p className="text-sm text-muted-foreground">Processing image…</p>
      )}
      {proofFile && !isCompressing && (
        <p className="text-sm text-foreground">
          Attached: {proofFile.name} ({getFileSizeLabel(proofFile.size)})
        </p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
