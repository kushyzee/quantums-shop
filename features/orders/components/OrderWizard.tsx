/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, useSelector } from "@tanstack/react-form";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import type { ServiceType } from "@/features/catalog/schema";
import type { PublicCatalogItem } from "@/features/catalog/queries";
import type { BankAccountRow } from "@/features/settings/queries";
import { orderFormLiveValidationSchema } from "../schema";
import { createOrder } from "../actions";
import { ItemVariantStep } from "./ItemVariantStep";
import { CustomerInfoStep } from "./CustomerInfoStep";
import { OrderConfirmation } from "./OrderConfirmation";

export type OrderFormValues = {
  serviceType: ServiceType;
  catalogVariantId: string;
  senderAccountName: string;
  customerWhatsappNumber: string;
  gameAccountEmail: string;
  gameAccountPassword: string;
  accountAccessConsent: boolean;
  paymentProofFile: File | null;
};

export type OrderForm = ReactFormExtendedApi<
  OrderFormValues,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

type OrderWizardProps = {
  serviceType: ServiceType;
  catalogItems: PublicCatalogItem[];
  bankAccounts: BankAccountRow[];
};

type WizardStep = 1 | 2;

export function OrderWizard({
  serviceType,
  catalogItems,
  bankAccounts,
}: OrderWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    orderCode: string;
    itemName: string;
    variantLabel: string;
    price: number;
    senderAccountName: string;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      serviceType,
      catalogVariantId: "",
      senderAccountName: "",
      customerWhatsappNumber: "",
      gameAccountEmail: "",
      gameAccountPassword: "",
      accountAccessConsent: false,
      paymentProofFile: null,
    } as OrderFormValues,
    validators: {
      onBlur: orderFormLiveValidationSchema,
      onChange: orderFormLiveValidationSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      const selectedVariant = findSelection(
        catalogItems,
        value.catalogVariantId,
      );

      const result = await createOrder(value, value.paymentProofFile);

      if (!result.success) {
        setSubmitError(
          result.formError ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setConfirmation({
        orderCode: result.data.orderCode,
        itemName: selectedVariant?.item.name ?? "",
        variantLabel: selectedVariant?.variant.label ?? "",
        price: selectedVariant?.variant.price ?? 0,
        senderAccountName: value.senderAccountName,
      });
    },
  });

  const selectedVariantId = useSelector(
    form.store,
    (s) => s.values.catalogVariantId,
  );
  const selection = findSelection(catalogItems, selectedVariantId);

  if (confirmation) {
    return <OrderConfirmation {...confirmation} />;
  }

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
        <>
          {selection && (
            <p className="text-sm text-muted-foreground">
              {selection.item.name}: {selection.variant.label}
            </p>
          )}
          {submitError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </div>
          )}
          <CustomerInfoStep
            form={form}
            serviceType={serviceType}
            bankAccounts={bankAccounts}
            onBack={() => setStep(1)}
          />
        </>
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
