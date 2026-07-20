/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { updateItem, toggleItemActive } from "../actions";
import { updateVariant, toggleVariantActive } from "../actions";
import { VariantCreateForm } from "./VariantCreateForm";
import { formatNaira } from "@/lib/currency";
import type { CatalogItemWithVariants, CatalogVariantRow } from "../queries";

export function VariantManager({ item }: { item: CatalogItemWithVariants }) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/catalog"
        className="text-sm text-muted-foreground hover:underline w-fit"
      >
        ← Back to catalog
      </Link>

      <ItemHeader item={item} />

      <VariantTable itemId={item.id} initialVariants={item.variants} />
    </div>
  );
}

function ItemHeader({ item }: { item: CatalogItemWithVariants }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [draft, setDraft] = useState(item.name);
  const [active, setActive] = useState(item.active);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleSaveName() {
    setError(null);
    startTransition(async () => {
      const result = await updateItem({ id: item.id, name: draft });
      if (!result.success) {
        setError(result.formError ?? "Could not save name.");
        return;
      }
      setName(draft.trim());
      setEditing(false);
    });
  }

  function handleToggleActive() {
    const next = !active;
    startTransition(async () => {
      const result = await toggleItemActive({ id: item.id, active: next });
      if (result.success) {
        setActive(next);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="max-w-xs"
              />
              <Button size="sm" onClick={handleSaveName}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDraft(name);
                  setEditing(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{name}</h2>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setEditing(true)}
              >
                Rename
              </Button>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {item.serviceType === "gaming" ? "Gaming" : "Gift Card"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {active ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={active}
            onCheckedChange={handleToggleActive}
            aria-label={active ? "Deactivate item" : "Activate item"}
          />
        </div>
      </div>
    </div>
  );
}

function VariantTable({
  itemId,
  initialVariants,
}: {
  itemId: string;
  initialVariants: CatalogVariantRow[];
}) {
  const [variants, setVariants] = useState(initialVariants);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-6 text-center text-muted-foreground"
                >
                  No options yet.
                </TableCell>
              </TableRow>
            )}
            {variants.map((variant) =>
              editingId === variant.id ? (
                <VariantEditRow
                  key={variant.id}
                  variant={variant}
                  onCancel={() => setEditingId(null)}
                  onSaved={(updated) => {
                    setVariants((prev) =>
                      prev
                        .map((v) => (v.id === updated.id ? updated : v))
                        .sort((a, b) => a.price - b.price),
                    );
                    setEditingId(null);
                  }}
                />
              ) : (
                <TableRow key={variant.id}>
                  <TableCell>{variant.label}</TableCell>
                  <TableCell>{formatNaira(variant.price)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={variant.active}
                      disabled={pendingId === variant.id}
                      onCheckedChange={() => {
                        setPendingId(variant.id);
                        const next = !variant.active;
                        toggleVariantActive({
                          id: variant.id,
                          active: next,
                        }).then((result) => {
                          if (result.success) {
                            setVariants((prev) =>
                              prev.map((v) =>
                                v.id === variant.id
                                  ? { ...v, active: next }
                                  : v,
                              ),
                            );
                          }
                          setPendingId(null);
                        });
                      }}
                      aria-label={
                        variant.active ? "Deactivate option" : "Activate option"
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(variant.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>

      <VariantCreateForm
        itemId={itemId}
        onCreated={(variant: any) =>
          setVariants((prev) =>
            [...prev, variant].sort((a, b) => a.price - b.price),
          )
        }
      />
    </div>
  );
}

function VariantEditRow({
  variant,
  onCancel,
  onSaved,
}: {
  variant: CatalogVariantRow;
  onCancel: () => void;
  onSaved: (variant: CatalogVariantRow) => void;
}) {
  const [label, setLabel] = useState(variant.label);
  const [price, setPrice] = useState(String(variant.price));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    const result = await updateVariant({
      id: variant.id,
      label,
      price: Number(price),
    });
    setIsSaving(false);
    if (!result.success) {
      const firstError =
        result.fieldErrors?.label?.[0] ??
        result.fieldErrors?.price?.[0] ??
        result.formError;
      setError(firstError ?? "Could not save option.");
      return;
    }
    onSaved({ ...variant, label: label.trim(), price: Number(price) });
  }

  return (
    <TableRow className="bg-muted/30">
      <TableCell>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </TableCell>
      <TableCell colSpan={2}>
        <div className="flex items-center justify-between gap-2">
          {error && <span className="text-sm text-destructive">{error}</span>}
          <div className="flex gap-2 ml-auto">
            <Button size="sm" disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
