import { z } from "zod";

export const SERVICE_TYPES = ["gaming", "giftcard"] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const createItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  serviceType: z.enum(SERVICE_TYPES, {
    error: "Select a service type",
  }),
});
export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
});
export type UpdateItemInput = z.infer<typeof updateItemSchema>;

export const toggleItemActiveSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
});
export type ToggleItemActiveInput = z.infer<typeof toggleItemActiveSchema>;

const priceSchema = z
  .number({ error: "Price is required" })
  .positive("Price must be greater than 0")
  .refine((val) => Number.isInteger(Math.round(val * 100)), {
    message: "Price can have at most 2 decimal places",
  });

export const createVariantSchema = z.object({
  itemId: z.uuid(),
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or fewer"),
  price: priceSchema,
});
export type CreateVariantInput = z.infer<typeof createVariantSchema>;

export const updateVariantSchema = z.object({
  id: z.uuid(),
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or fewer"),
  price: priceSchema,
});
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;

export const toggleVariantActiveSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
});
export type ToggleVariantActiveInput = z.infer<
  typeof toggleVariantActiveSchema
>;
