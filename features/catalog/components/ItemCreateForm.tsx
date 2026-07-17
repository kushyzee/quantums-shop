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
import { createItemSchema, type ServiceType } from "../schema";
import { createItem } from "../actions";
import type { CatalogItemListRow } from "../queries";

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  gaming: "Gaming",
  giftcard: "Gift Card",
};

export function ItemCreateForm({
  onCreated,
}: {
  onCreated: (item: CatalogItemListRow) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", serviceType: "gaming" as ServiceType },
    validators: { onChange: createItemSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const result = await createItem(value);
      if (!result.success) {
        setFormError(
          result.formError ?? "Something went wrong. Please try again.",
        );
        return;
      }
      onCreated({
        id: result.data.id,
        name: value.name.trim(),
        serviceType: value.serviceType,
        active: true,
        variantCount: 0,
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
      <h3 className="text-sm font-medium">Add item</h3>

      {formError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </div>
      )}

      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                placeholder="e.g. PUBG Mobile"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="serviceType">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>Service type</FieldLabel>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as ServiceType)
                }
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {SERVICE_TYPE_LABELS[type]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
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
            {isSubmitting ? "Adding..." : "Add item"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
