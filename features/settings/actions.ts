"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  createBankAccountSchema,
  updateBankAccountSchema,
  toggleBankAccountActiveSchema,
  setPrimaryBankAccountSchema,
  deleteBankAccountSchema,
} from "./schema";
import { getActiveBankAccountCount } from "./queries";

type ActionResult<TData = undefined> =
  | { success: true; data: TData }
  | {
      success: false;
      fieldErrors?: Record<string, string[] | undefined>;
      formError?: string;
    };

const MAX_ACTIVE_BANK_ACCOUNTS = 2;

export async function createBankAccount(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createBankAccountSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        bankName: tree.properties?.bankName?.errors,
        accountNumber: tree.properties?.accountNumber?.errors,
        accountName: tree.properties?.accountName?.errors,
      },
    };
  }

  const activeCount = await getActiveBankAccountCount();
  if (activeCount >= MAX_ACTIVE_BANK_ACCOUNTS) {
    return {
      success: false,
      formError: `Maximum of ${MAX_ACTIVE_BANK_ACCOUNTS} active bank accounts reached. Deactivate or delete one first.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert({
      bank_name: parsed.data.bankName,
      account_number: parsed.data.accountNumber,
      account_name: parsed.data.accountName,
      is_primary: activeCount === 0, // first account is auto-primary
      active: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createBankAccount error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/settings");
  return { success: true, data: { id: data.id } };
}

export async function updateBankAccount(input: unknown): Promise<ActionResult> {
  const parsed = updateBankAccountSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        bankName: tree.properties?.bankName?.errors,
        accountNumber: tree.properties?.accountNumber?.errors,
        accountName: tree.properties?.accountName?.errors,
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bank_accounts")
    .update({
      bank_name: parsed.data.bankName,
      account_number: parsed.data.accountNumber,
      account_name: parsed.data.accountName,
    })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("updateBankAccount error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/settings");
  return { success: true, data: undefined };
}

export async function toggleBankAccountActive(
  input: unknown,
): Promise<ActionResult> {
  const parsed = toggleBankAccountActiveSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }

  if (parsed.data.active) {
    const activeCount = await getActiveBankAccountCount();
    if (activeCount >= MAX_ACTIVE_BANK_ACCOUNTS) {
      return {
        success: false,
        formError: `Maximum of ${MAX_ACTIVE_BANK_ACCOUNTS} active bank accounts reached.`,
      };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bank_accounts")
    .update({
      active: parsed.data.active,
      ...(parsed.data.active ? {} : { is_primary: false }),
    })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("toggleBankAccountActive error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/settings");
  return { success: true, data: undefined };
}

export async function setPrimaryBankAccount(
  input: unknown,
): Promise<ActionResult> {
  const parsed = setPrimaryBankAccountSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }

  const supabase = await createClient();

  const { data: target, error: targetError } = await supabase
    .from("bank_accounts")
    .select("active")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (targetError || !target) {
    console.error(
      "setPrimaryBankAccount lookup error:",
      targetError?.code,
      targetError?.message,
    );
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  if (!target.active) {
    return {
      success: false,
      formError: "Only an active bank account can be set as primary.",
    };
  }

  const { error: clearError } = await supabase
    .from("bank_accounts")
    .update({ is_primary: false })
    .neq("id", parsed.data.id);

  if (clearError) {
    console.error(
      "setPrimaryBankAccount clear error:",
      clearError.code,
      clearError.message,
    );
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  const { error: setError } = await supabase
    .from("bank_accounts")
    .update({ is_primary: true })
    .eq("id", parsed.data.id);

  if (setError) {
    console.error(
      "setPrimaryBankAccount set error:",
      setError.code,
      setError.message,
    );
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/settings");
  return { success: true, data: undefined };
}

export async function deleteBankAccount(input: unknown): Promise<ActionResult> {
  const parsed = deleteBankAccountSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, formError: "Invalid request." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    console.error("deleteBankAccount error:", error.code, error.message);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/settings");
  return { success: true, data: undefined };
}
