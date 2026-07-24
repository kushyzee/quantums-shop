import { z } from "zod";
import { SERVICE_TYPES } from "@/features/catalog/schema";
import type { ServiceType } from "@/features/catalog/schema";

export const ORDER_STATUSES = [
  "payment_submitted",
  "verified",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DEFAULT_ORDER_STATUS_FILTER: OrderStatus[] = [
  "payment_submitted",
  "verified",
];

export const MAX_PROOF_IMAGE_SIZE_MB = 5;
export const MAX_PROOF_IMAGE_SIZE_BYTES = MAX_PROOF_IMAGE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_PROOF_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const whatsappNumberSchema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{7,14}$/,
    "Enter your number with country code, e.g. +234 801 234 5678",
  );

const senderAccountNameSchema = z
  .string()
  .trim()
  .min(2, "Enter the name on the sending account")
  .max(100, "That name looks too long, please shorten it");

const baseOrderFields = {
  catalogVariantId: z.uuid("Select a valid item and variant"),
  senderAccountName: senderAccountNameSchema,
  customerWhatsappNumber: whatsappNumberSchema,
};

export const giftCardOrderSchema = z.object({
  serviceType: z.literal("giftcard"),
  ...baseOrderFields,
});

export const gamingOrderSchema = z.object({
  serviceType: z.literal("gaming"),
  ...baseOrderFields,
  gameAccountEmail: z.email("Enter a valid account email"),
  gameAccountPassword: z.string().min(1, "Enter the account password"),
  accountAccessConsent: z.boolean().refine((v) => v === true, {
    message: "Please confirm you understand before continuing",
  }),
});

export const createOrderSchema = z.discriminatedUnion("serviceType", [
  gamingOrderSchema,
  giftCardOrderSchema,
]);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type GamingOrderInput = z.infer<typeof gamingOrderSchema>;
export type GiftCardOrderInput = z.infer<typeof giftCardOrderSchema>;

const proofImageRefinements = {
  type: (file: File) =>
    (ACCEPTED_PROOF_IMAGE_TYPES as readonly string[]).includes(file.type),
  size: (file: File) => file.size <= MAX_PROOF_IMAGE_SIZE_BYTES,
};

export const proofImageSchema = z
  .instanceof(File)
  .refine(proofImageRefinements.type, {
    message: "Only JPG, PNG, or WEBP images are accepted",
  })
  .refine(proofImageRefinements.size, {
    message: `Image must be ${MAX_PROOF_IMAGE_SIZE_MB}MB or smaller`,
  })
  .optional();

export const completionProofImageSchema = z
  .instanceof(File)
  .refine(proofImageRefinements.type, {
    message: "Only JPG, PNG, or WEBP images are accepted",
  })
  .refine(proofImageRefinements.size, {
    message: `Image must be ${MAX_PROOF_IMAGE_SIZE_MB}MB or smaller`,
  });

export function deriveOrderCode(orderId: string): string {
  return `QS-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export const orderFormLiveValidationSchema = z
  .object({
    serviceType: z.enum(SERVICE_TYPES),
    catalogVariantId: z.uuid("Select a valid item and variant"),
    senderAccountName: senderAccountNameSchema,
    customerWhatsappNumber: whatsappNumberSchema,
    gameAccountEmail: z.string(),
    gameAccountPassword: z.string(),
    accountAccessConsent: z.boolean(),
    paymentProofFile: z.instanceof(File).nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType !== "gaming") {
      return;
    }

    if (!z.email().safeParse(data.gameAccountEmail).success) {
      ctx.addIssue({
        code: "custom",
        path: ["gameAccountEmail"],
        message: "Enter a valid account email",
      });
    }

    if (data.gameAccountPassword.length < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["gameAccountPassword"],
        message: "Enter the account password",
      });
    }

    if (data.accountAccessConsent !== true) {
      ctx.addIssue({
        code: "custom",
        path: ["accountAccessConsent"],
        message: "Please confirm you understand before continuing",
      });
    }
  });

export function parseOrderStatusFilter(raw?: string): OrderStatus[] {
  if (!raw) return DEFAULT_ORDER_STATUS_FILTER;
  if (raw === "none") return [];

  const parsed = raw
    .split(",")
    .filter((value): value is OrderStatus =>
      (ORDER_STATUSES as readonly string[]).includes(value),
    );

  return parsed.length > 0 ? parsed : DEFAULT_ORDER_STATUS_FILTER;
}

export function parseServiceTypeFilter(raw?: string): ServiceType | "all" {
  if (raw === "gaming" || raw === "giftcard") return raw;
  return "all";
}

export const ORDER_ACTIONS_BY_STATUS: Record<
  OrderStatus,
  Array<"verify" | "complete" | "cancel">
> = {
  payment_submitted: ["verify", "cancel"],
  verified: ["complete", "cancel"],
  completed: [],
  cancelled: [],
};

export const orderIdSchema = z.object({
  orderId: z.uuid("Invalid order"),
});
export type OrderIdInput = z.infer<typeof orderIdSchema>;

export const cancelOrderSchema = z.object({
  orderId: z.uuid("Invalid order"),
  cancellationReason: z
    .string()
    .trim()
    .min(1, "Enter a reason for cancelling this order")
    .max(500, "That reason looks too long, please shorten it"),
});
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
