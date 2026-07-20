import Link from "next/link";
import { OrderWizard } from "@/features/orders/components/OrderWizard";
import { listCatalogPublic } from "@/features/catalog/queries";
import { listBankAccountsPublic } from "@/features/settings/queries";

export default async function GamingOrderPage() {
  const [catalogItems, bankAccounts] = await Promise.all([
    listCatalogPublic("gaming"),
    listBankAccountsPublic(),
  ]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
      <Link
        href="/"
        className="w-fit text-sm text-muted-foreground hover:underline"
      >
        ← Back to home
      </Link>

      <div className="text-center">
        <h1 className="text-2xl font-semibold">Order a Gaming Top-Up</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your game, confirm payment, and we&rsquo;ll top you up shortly.
        </p>
      </div>

      <OrderWizard
        serviceType="gaming"
        catalogItems={catalogItems}
        bankAccounts={bankAccounts}
      />
    </main>
  );
}
