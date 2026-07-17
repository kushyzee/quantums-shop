import { createClient } from "@/lib/supabase/server";

export type BankAccountRow = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
  active: boolean;
  createdAt: string;
};

function mapRow(row: {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
  active: boolean;
  created_at: string;
}): BankAccountRow {
  return {
    id: row.id,
    bankName: row.bank_name,
    accountNumber: row.account_number,
    accountName: row.account_name,
    isPrimary: row.is_primary,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function listBankAccountsAdmin(): Promise<BankAccountRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bank_accounts")
    .select(
      "id, bank_name, account_number, account_name, is_primary, active, created_at",
    )
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listBankAccountsAdmin error:", error.code, error.message);
    throw new Error("Failed to load bank accounts.");
  }

  return (data ?? []).map(mapRow);
}

export async function listBankAccountsPublic(): Promise<BankAccountRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bank_accounts")
    .select(
      "id, bank_name, account_number, account_name, is_primary, active, created_at",
    )
    .eq("active", true)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listBankAccountsPublic error:", error.code, error.message);
    throw new Error("Failed to load bank accounts.");
  }

  return (data ?? []).map(mapRow);
}

export async function getActiveBankAccountCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("bank_accounts")
    .select("id", { count: "exact", head: true })
    .eq("active", true);

  if (error) {
    console.error(
      "getActiveBankAccountCount error:",
      error.code,
      error.message,
    );
    throw new Error("Failed to check bank account count.");
  }

  return count ?? 0;
}
