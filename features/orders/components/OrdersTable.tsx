import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatNaira } from "@/lib/currency";
import { formatRelativeTime } from "../formatRelativeTime";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ServiceTypeBadge } from "./ServiceTypeBadge";
import type { OrderListRow } from "../queries";

export function OrdersTable({ orders }: { orders: OrderListRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Item / Option</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-6 text-center text-muted-foreground"
              >
                No orders match the current view.
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-medium hover:underline"
                >
                  {order.orderCode}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {order.itemName}: {order.variantLabel}
              </TableCell>
              <TableCell>{formatNaira(order.price)}</TableCell>
              <TableCell>
                <ServiceTypeBadge serviceType={order.serviceType} />
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.senderAccountName}</TableCell>
              <TableCell className="text-muted-foreground">
                {order.customerWhatsappNumber}
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                title={new Date(order.createdAt).toLocaleString()}
              >
                {formatRelativeTime(order.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
