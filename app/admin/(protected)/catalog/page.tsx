import { ItemList } from "@/features/catalog/components/ItemList";
import { listCatalogAdmin } from "@/features/catalog/queries";

export default async function CatalogPage() {
  const items = await listCatalogAdmin();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-semibold">Catalog</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the games and gift cards customers can order.
        </p>
      </div>

      <ItemList initialItems={items} />
    </main>
  );
}
