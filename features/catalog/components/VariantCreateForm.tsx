"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { createVariantSchema } from "../schema";
import { createVariant } from "../actions";
import type { CatalogVariantRow } from "../queries";

export function VariantCreateForm({
  itemId,
  onCreated,
}: {
  itemId: string;
  onCreated: (variant: CatalogVariantRow) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { itemId, label: "", price: 0 },
    validators: { onChange: createVariantSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const result = await createVariant(value);
      if (!result.success) {
        setFormError(
          result.formError ?? "Something went wrong. Please try again.",
        );
        return;
      }
      onCreated({
        id: result.data.id,
        label: value.label.trim(),
        price: value.price,
        active: true,
        createdAt: new Date().toISOString(),
      });
      form.reset();
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
      <h3 className="text-sm font-medium">Add option</h3>

      {formError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </div>
      )}

      <FieldGroup className="sm:flex-row sm:items-start">
        <form.Field name="label">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>Label</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                placeholder="e.g. 880 CP"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="price">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>Price (₦)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.state.value === 0 ? "" : field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="self-start"
          >
            {isSubmitting ? "Adding..." : "Add option"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
