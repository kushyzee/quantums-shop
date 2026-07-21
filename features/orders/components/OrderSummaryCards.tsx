import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { OrderCounts } from "../queries";

const CARD_CONFIG: { key: keyof OrderCounts; label: string }[] = [
  { key: "payment_submitted", label: "Awaiting Payment" },
  { key: "verified", label: "Verified" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export function OrderSummaryCards({ counts }: { counts: OrderCounts }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {CARD_CONFIG.map((card) => (
        <Card key={card.key}>
          <CardHeader>
            <CardTitle className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{counts[card.key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
