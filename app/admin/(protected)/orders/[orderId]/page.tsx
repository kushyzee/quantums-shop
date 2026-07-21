import { notFound } from "next/navigation";
import { getOrderById } from "@/features/orders/queries";
import { OrderDetail } from "@/features/orders/components/OrderDetail";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <OrderDetail order={order} />
    </main>
  );
}
