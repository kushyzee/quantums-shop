import { BankAccountList } from "@/features/settings/components/BankAccountList";
import { listBankAccountsAdmin } from "@/features/settings/queries";
import { MAX_ACTIVE_BANK_ACCOUNTS } from "@/features/settings/schema";

export default async function SettingsPage() {
  const accounts = await listBankAccountsAdmin();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold">Bank accounts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the accounts customers pay into. Up to{" "}
          {MAX_ACTIVE_BANK_ACCOUNTS} can be active at once.
        </p>
      </div>

      <BankAccountList initialAccounts={accounts} />
    </main>
  );
}
