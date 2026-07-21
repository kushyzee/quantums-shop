import { createClient } from "@/lib/supabase/server";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { getOrderCounts, listOrders } from "@/features/orders/queries";
import {
  parseOrderStatusFilter,
  parseServiceTypeFilter,
} from "@/features/orders/schema";
import { OrderSummaryCards } from "@/features/orders/components/OrderSummaryCards";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { OrdersFilters } from "@/features/orders/components/OrdersFilters";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; service?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const statuses = parseOrderStatusFilter(params.status);
  const serviceType = parseServiceTypeFilter(params.service);
  const search = params.q ?? "";

  const [counts, orders] = await Promise.all([
    getOrderCounts(),
    listOrders({ statuses, serviceType, search }),
  ]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Logged in as {user?.email}
          </p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline">
            Log out
          </Button>
        </form>
      </div>

      <OrderSummaryCards counts={counts} />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Orders</h2>
        <OrdersFilters
          activeStatuses={statuses}
          activeService={serviceType}
          activeSearch={search}
        />
        <OrdersTable orders={orders} />
      </div>
    </main>
  );
}
