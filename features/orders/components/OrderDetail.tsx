import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatNaira } from "@/lib/currency";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ServiceTypeBadge } from "./ServiceTypeBadge";
import { RevealCredentialsPanel } from "./RevealCredentialsPanel";
import { OrderActionToolbar } from "./OrderActionToolbar";
import type { OrderDetail as OrderDetailType } from "../queries";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export function OrderDetail({ order }: { order: OrderDetailType }) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/dashboard"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-wide">
          {order.orderCode}
        </h1>
        <OrderStatusBadge status={order.status} />
        <ServiceTypeBadge serviceType={order.serviceType} />
      </div>

      <OrderActionToolbar order={order} />

      <Card>
        <CardHeader>
          <CardTitle>Order details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailRow
            label="Item / Option"
            value={`${order.variantLabel} ${order.itemName}`}
          />
          <DetailRow label="Price" value={formatNaira(order.price)} />
          <DetailRow label="Sender name" value={order.senderAccountName} />
          <DetailRow
            label="WhatsApp number"
            value={order.customerWhatsappNumber}
          />
          <DetailRow
            label="Created"
            value={new Date(order.createdAt).toLocaleString()}
          />
          {order.completedAt && (
            <DetailRow
              label="Completed"
              value={new Date(order.completedAt).toLocaleString()}
            />
          )}
          {order.cancelledAt && (
            <DetailRow
              label="Cancelled"
              value={new Date(order.cancelledAt).toLocaleString()}
            />
          )}
          {order.cancellationReason && (
            <DetailRow
              label="Cancellation reason"
              value={order.cancellationReason}
            />
          )}
          {order.credentialStatus && (
            <DetailRow
              label="Game account credentials"
              value={
                <RevealCredentialsPanel
                  orderId={order.id}
                  credentialStatus={order.credentialStatus}
                />
              }
            />
          )}
        </CardContent>
      </Card>

      {order.paymentProofSignedUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Proof images</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Payment proof
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.paymentProofSignedUrl}
                alt="Payment proof"
                className="rounded-md border border-border"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
