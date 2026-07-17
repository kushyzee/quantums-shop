"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toggleItemActive } from "../actions";
import { ItemCreateForm } from "./ItemCreateForm";
import type { CatalogItemListRow } from "../queries";
import type { ServiceType } from "../schema";

const FILTERS: { label: string; value: ServiceType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Gaming", value: "gaming" },
  { label: "Gift Cards", value: "giftcard" },
];

export function ItemList({
  initialItems,
}: {
  initialItems: CatalogItemListRow[];
}) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<ServiceType | "all">("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visibleItems = items.filter(
    (item) => filter === "all" || item.serviceType === filter,
  );

  function handleToggle(item: CatalogItemListRow) {
    const nextActive = !item.active;
    setPendingId(item.id);

    startTransition(async () => {
      const result = await toggleItemActive({
        id: item.id,
        active: nextActive,
      });
      if (result.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, active: nextActive } : i,
          ),
        );
      }
      setPendingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as ServiceType | "all")}
      >
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-6 text-center text-muted-foreground"
                >
                  No items yet.
                </TableCell>
              </TableRow>
            )}
            {visibleItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/admin/catalog/${item.id}`}
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {item.serviceType === "gaming" ? "Gaming" : "Gift Card"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.variantCount}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.active}
                    disabled={pendingId === item.id}
                    onCheckedChange={() => handleToggle(item)}
                    aria-label={
                      item.active ? "Deactivate item" : "Activate item"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ItemCreateForm
        onCreated={(item: CatalogItemListRow) =>
          setItems((prev) => [item, ...prev])
        }
      />
    </div>
  );
}
