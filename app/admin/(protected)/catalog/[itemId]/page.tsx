import { notFound } from "next/navigation";
import { VariantManager } from "@/features/catalog/components/VariantManager";
import { getItemWithVariants } from "@/features/catalog/queries";

export default async function CatalogItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getItemWithVariants(itemId);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <VariantManager item={item} />
    </main>
  );
}
