"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { createBankAccountSchema } from "../schema";
import { createBankAccount } from "../actions";
import { NIGERIAN_BANKS } from "@/lib/nigerianBanks";
import type { BankAccountRow } from "../queries";

const OTHER_OPTION = "__other__";

export function BankAccountCreateForm({
  onCreated,
}: {
  onCreated: (account: BankAccountRow) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [bankSelection, setBankSelection] = useState<string>(NIGERIAN_BANKS[0]);
  const [customBankName, setCustomBankName] = useState("");

  const form = useForm({
    defaultValues: {
      bankName: (NIGERIAN_BANKS[0] ?? "") as string,
      accountNumber: "",
      accountName: "",
    },
    validators: {
      onBlur: createBankAccountSchema,
      onChange: createBankAccountSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const result = await createBankAccount(value);
      if (!result.success) {
        setFormError(
          result.formError ?? "Something went wrong. Please try again.",
        );
        return;
      }
      onCreated(result.data);
      form.reset();
      setBankSelection(NIGERIAN_BANKS[0]);
      setCustomBankName("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <h3 className="text-sm font-medium">Add bank account</h3>

      {formError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </div>
      )}

      <FieldGroup>
        <form.Field name="bankName">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>Bank</FieldLabel>
              <Select
                value={bankSelection}
                onValueChange={(value) => {
                  setBankSelection(value ?? "");
                  field.handleChange(
                    (value === OTHER_OPTION ? customBankName : value) ?? "",
                  );
                }}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_BANKS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHER_OPTION}>
                    Other (type manually)
                  </SelectItem>
                </SelectContent>
              </Select>
              {bankSelection === OTHER_OPTION && (
                <Input
                  className="mt-2"
                  placeholder="Enter bank name"
                  value={customBankName}
                  onChange={(e) => {
                    setCustomBankName(e.target.value);
                    field.handleChange(e.target.value);
                  }}
                />
              )}
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="accountNumber">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>Account number</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit NUBAN"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="accountName">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>Account name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                placeholder="e.g. Quantum's Shop"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Adding..." : "Add bank account"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
