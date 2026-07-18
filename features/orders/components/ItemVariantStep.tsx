/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/currency";
import type { PublicCatalogItem } from "@/features/catalog/queries";
import type { OrderForm } from "./OrderWizard";

type ItemVariantStepProps = {
  form: OrderForm;
  catalogItems: PublicCatalogItem[];
  onContinue: () => void;
};

export function ItemVariantStep({
  form,
  catalogItems,
  onContinue,
}: ItemVariantStepProps) {
  if (catalogItems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Nothing&rsquo;s available to order right now — please check back shortly
        or reach out on WhatsApp.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <form.Field name="catalogVariantId">
        {(field: {
          state: {
            value: string;
            meta: { errors: Array<{ message?: string } | string | undefined> };
          };
          handleChange: (arg0: string) => void;
        }) => {
          const item = findItemForVariant(catalogItems, field.state.value);

          return (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="catalog-item">Item</FieldLabel>
                <Select
                  value={item?.id ?? ""}
                  onValueChange={(itemId) => {
                    const nextItem = catalogItems.find((i) => i.id === itemId);
                    // Changing the item always resets to its cheapest
                    // (first, since the query sorts price ascending)
                    // variant — a stale variant id from a different item
                    // is never valid.
                    field.handleChange(nextItem?.variants[0]?.id ?? "");
                  }}
                >
                  <SelectTrigger id="catalog-item" className="w-full">
                    {item ? (
                      <SelectValue />
                    ) : (
                      <span className="text-muted-foreground">
                        Choose an item
                      </span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {catalogItems.map((catalogItem) => (
                      <SelectItem key={catalogItem.id} value={catalogItem.id}>
                        {catalogItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                data-invalid={field.state.meta.errors!.length > 0 || undefined}
              >
                <FieldLabel htmlFor="catalog-variant">Option</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(variantId) =>
                    field.handleChange(variantId ?? "")
                  }
                  disabled={!item}
                >
                  <SelectTrigger id="catalog-variant" className="w-full">
                    {field.state.value ? (
                      <SelectValue />
                    ) : (
                      <span className="text-muted-foreground">
                        Choose an option
                      </span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {item?.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.label} — {formatNaira(variant.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError
                  errors={field.state.meta.errors.map((e) =>
                    typeof e === "string" ? { message: e } : e,
                  )}
                />
              </Field>

              {item && (
                <PriceSummary item={item} variantId={field.state.value} />
              )}
            </FieldGroup>
          );
        }}
      </form.Field>

      <form.Subscribe
        selector={(state: { values: { catalogVariantId: any } }) =>
          state.values.catalogVariantId
        }
      >
        {(catalogVariantId: any) => (
          <Button
            type="button"
            disabled={!catalogVariantId}
            onClick={onContinue}
          >
            Continue
          </Button>
        )}
      </form.Subscribe>
    </div>
  );
}

function PriceSummary({
  item,
  variantId,
}: {
  item: PublicCatalogItem;
  variantId: string;
}) {
  const variant = item.variants.find((v) => v.id === variantId);
  if (!variant) return null;

  return (
    <div className="flex items-center justify-between rounded-md bg-secondary px-4 py-3 text-sm">
      <span className="text-muted-foreground">Price</span>
      <span className="font-medium">{formatNaira(variant.price)}</span>
    </div>
  );
}

function findItemForVariant(
  items: PublicCatalogItem[],
  variantId: string,
): PublicCatalogItem | null {
  if (!variantId) return null;
  return (
    items.find((item) => item.variants.some((v) => v.id === variantId)) ?? null
  );
}
