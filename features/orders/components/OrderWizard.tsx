"use client";

import { useState } from "react";
import { useForm, useSelector } from "@tanstack/react-form";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import type { ServiceType } from "@/features/catalog/schema";
import type { PublicCatalogItem } from "@/features/catalog/queries";
import { ItemVariantStep } from "./ItemVariantStep";

export type OrderFormValues = {
  catalogVariantId: string;
  senderAccountName: string;
  customerWhatsappNumber: string;
  gameAccountEmail: string;
  gameAccountPassword: string;
  accountAccessConsent: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OrderForm = ReactFormExtendedApi<OrderFormValues, any, any, any, any, any, any, any, any, any, any, any>;

const EMPTY_VALUES: OrderFormValues = {
  catalogVariantId: "",
  senderAccountName: "",
  customerWhatsappNumber: "",
  gameAccountEmail: "",
  gameAccountPassword: "",
  accountAccessConsent: false,
};

type OrderWizardProps = {
  serviceType: ServiceType;
  catalogItems: PublicCatalogItem[];
};

export function OrderWizard({ serviceType, catalogItems }: OrderWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm({
    defaultValues: EMPTY_VALUES,
    onSubmit: async ({ value }) => {
      console.log("order submit (placeholder)", value);
    },
  });

  const selectedVariantId = useSelector(form.store, (s) => s.values.catalogVariantId);
  const selection = findSelection(catalogItems, selectedVariantId);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li className={step === 1 ? "font-medium text-foreground" : undefined}>
          1. Choose item
        </li>
        <li aria-hidden>→</li>
        <li className={step === 2 ? "font-medium text-foreground" : undefined}>
          2. Your details
        </li>
      </ol>

      {step === 1 && (
        <ItemVariantStep
          form={form}
          catalogItems={catalogItems}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>
            Bank details, your info
            {serviceType === "gaming" ? ", account access" : ""}, and proof
            upload land here in the next phase.
          </p>
          {selection && (
            <p className="mt-2 text-foreground">
              Selected: {selection.item.name} — {selection.variant.label}
            </p>
          )}
          <button
            type="button"
            className="mt-4 text-sm text-primary underline underline-offset-4"
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

function findSelection(items: PublicCatalogItem[], variantId: string) {
  if (!variantId) return null;
  for (const item of items) {
    const variant = item.variants.find((v) => v.id === variantId);
    if (variant) return { item, variant };
  }
  return null;
}
