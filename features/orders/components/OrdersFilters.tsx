"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_STATUSES, type OrderStatus } from "../schema";
import type { ServiceType } from "@/features/catalog/schema";

const STATUS_LABELS: Record<OrderStatus, string> = {
  payment_submitted: "Awaiting Payment",
  verified: "Verified",
  completed: "Completed",
  cancelled: "Cancelled",
};

const SERVICE_FILTERS: { label: string; value: ServiceType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Gaming", value: "gaming" },
  { label: "Gift Cards", value: "giftcard" },
];

export function OrdersFilters({
  activeStatuses,
  activeService,
  activeSearch,
}: {
  activeStatuses: OrderStatus[];
  activeService: ServiceType | "all";
  activeSearch: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(activeSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(next: {
    statuses?: OrderStatus[];
    service?: ServiceType | "all";
    q?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    const statuses = next.statuses ?? activeStatuses;
    params.set("status", statuses.length > 0 ? statuses.join(",") : "none");

    const service = next.service ?? activeService;
    if (service === "all") {
      params.delete("service");
    } else {
      params.set("service", service);
    }

    const q = next.q ?? searchValue;
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function toggleStatus(status: OrderStatus) {
    const next = activeStatuses.includes(status)
      ? activeStatuses.filter((s) => s !== status)
      : [...activeStatuses, status];
    updateParams({ statuses: next });
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value }), 400);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        {ORDER_STATUSES.map((status) => (
          <label key={status} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={activeStatuses.includes(status)}
              onCheckedChange={() => toggleStatus(status)}
            />
            {STATUS_LABELS[status]}
          </label>
        ))}
      </div>

      <Tabs
        value={activeService}
        onValueChange={(value) =>
          updateParams({ service: value as ServiceType | "all" })
        }
      >
        <TabsList>
          {SERVICE_FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Input
        placeholder="Search sender, WhatsApp, or order code"
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
    </div>
  );
}
