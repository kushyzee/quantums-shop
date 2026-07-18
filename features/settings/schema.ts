import { z } from "zod";

export const MAX_ACTIVE_BANK_ACCOUNTS = 2;

export const createBankAccountSchema = z.object({
  bankName: z
    .string()
    .trim()
    .min(1, "Bank name is required")
    .max(100, "Bank name must be 100 characters or fewer"),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  accountName: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(100, "Account name must be 100 characters or fewer"),
});
export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;

export const updateBankAccountSchema = createBankAccountSchema.extend({
  id: z.uuid(),
});
export type UpdateBankAccountInput = z.infer<typeof updateBankAccountSchema>;

export const toggleBankAccountActiveSchema = z.object({
  id: z.uuid(),
  active: z.boolean(),
});
export type ToggleBankAccountActiveInput = z.infer<
  typeof toggleBankAccountActiveSchema
>;

export const setPrimaryBankAccountSchema = z.object({
  id: z.uuid(),
});
export type SetPrimaryBankAccountInput = z.infer<
  typeof setPrimaryBankAccountSchema
>;

export const deleteBankAccountSchema = z.object({
  id: z.uuid(),
});
export type DeleteBankAccountInput = z.infer<typeof deleteBankAccountSchema>;
