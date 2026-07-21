import { Badge } from "@/components/ui/badge";
import type { ServiceType } from "@/features/catalog/schema";

export function ServiceTypeBadge({
  serviceType,
}: {
  serviceType: ServiceType;
}) {
  return (
    <Badge variant="secondary">
      {serviceType === "gaming" ? "Gaming" : "Gift Card"}
    </Badge>
  );
}
