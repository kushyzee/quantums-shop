"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  toggleBankAccountActive,
  setPrimaryBankAccount,
  deleteBankAccount,
  updateBankAccount,
} from "../actions";
import { BankAccountCreateForm } from "./BankAccountCreateForm";
import { NIGERIAN_BANKS } from "@/lib/nigerianBanks";
import type { BankAccountRow } from "../queries";
import { MAX_ACTIVE_BANK_ACCOUNTS } from "../schema";

const OTHER_OPTION = "__other__";

export function BankAccountList({
  initialAccounts,
}: {
  initialAccounts: BankAccountRow[];
}) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const activeCount = accounts.filter((a) => a.active).length;
  const canAddMore = activeCount < MAX_ACTIVE_BANK_ACCOUNTS;

  function handleToggleActive(account: BankAccountRow) {
    const nextActive = !account.active;
    setPendingId(account.id);
    startTransition(async () => {
      const result = await toggleBankAccountActive({
        id: account.id,
        active: nextActive,
      });
      if (result.success) {
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === account.id
              ? {
                  ...a,
                  active: nextActive,
                  isPrimary: nextActive ? a.isPrimary : false,
                }
              : a,
          ),
        );
      }
      setPendingId(null);
    });
  }

  function handleSetPrimary(account: BankAccountRow) {
    setPendingId(account.id);
    startTransition(async () => {
      const result = await setPrimaryBankAccount({ id: account.id });
      if (result.success) {
        setAccounts((prev) =>
          prev.map((a) => ({ ...a, isPrimary: a.id === account.id })),
        );
      }
      setPendingId(null);
    });
  }

  function handleDelete(account: BankAccountRow) {
    setPendingId(account.id);
    startTransition(async () => {
      const result = await deleteBankAccount({ id: account.id });
      if (result.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== account.id));
      }
      setPendingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {accounts.length === 0 && (
          <p className="text-sm text-muted-foreground">No bank accounts yet.</p>
        )}
        {accounts.map((account) =>
          editingId === account.id ? (
            <BankAccountEditCard
              key={account.id}
              account={account}
              onCancel={() => setEditingId(null)}
              onSaved={(updated) => {
                setAccounts((prev) =>
                  prev.map((a) => (a.id === updated.id ? updated : a)),
                );
                setEditingId(null);
              }}
            />
          ) : (
            <div
              key={account.id}
              className="flex flex-col gap-3 rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{account.bankName}</h3>
                    <Badge
                      variant={account.isPrimary ? "default" : "secondary"}
                    >
                      {account.isPrimary ? "Primary" : "Secondary"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.accountNumber} · {account.accountName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {account.active ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={account.active}
                    disabled={
                      pendingId === account.id ||
                      (!account.active && !canAddMore)
                    }
                    onCheckedChange={() => handleToggleActive(account)}
                    aria-label={
                      account.active ? "Deactivate account" : "Activate account"
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!account.isPrimary && account.active && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pendingId === account.id}
                    onClick={() => handleSetPrimary(account)}
                  >
                    Set as primary
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(account.id)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={pendingId === account.id}
                      >
                        Delete
                      </Button>
                    }
                  ></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete bank account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {account.bankName}: {account.accountNumber} (
                        {account.accountName}) will be permanently deleted. This
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(account)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ),
        )}
      </div>

      {canAddMore ? (
        <BankAccountCreateForm
          onCreated={(account) => setAccounts((prev) => [...prev, account])}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Maximum of {MAX_ACTIVE_BANK_ACCOUNTS} active bank accounts reached.
          Deactivate one to add another.
        </p>
      )}
    </div>
  );
}

function BankAccountEditCard({
  account,
  onCancel,
  onSaved,
}: {
  account: BankAccountRow;
  onCancel: () => void;
  onSaved: (account: BankAccountRow) => void;
}) {
  const isKnownBank = (NIGERIAN_BANKS as readonly string[]).includes(
    account.bankName,
  );
  const [bankSelection, setBankSelection] = useState<string>(
    isKnownBank ? account.bankName : OTHER_OPTION,
  );
  const [customBankName, setCustomBankName] = useState(
    isKnownBank ? "" : account.bankName,
  );
  const [accountNumber, setAccountNumber] = useState(account.accountNumber);
  const [accountName, setAccountName] = useState(account.accountName);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const effectiveBankName =
    bankSelection === OTHER_OPTION ? customBankName : bankSelection;

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    const result = await updateBankAccount({
      id: account.id,
      bankName: effectiveBankName,
      accountNumber,
      accountName,
    });
    setIsSaving(false);
    if (!result.success) {
      const firstError =
        result.fieldErrors?.bankName?.[0] ??
        result.fieldErrors?.accountNumber?.[0] ??
        result.fieldErrors?.accountName?.[0] ??
        result.formError;
      setError(firstError ?? "Could not save bank account.");
      return;
    }
    onSaved({
      ...account,
      bankName: effectiveBankName.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex max-w-sm flex-col gap-2">
        <Select
          value={bankSelection}
          onValueChange={(value) => setBankSelection(value ?? "")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_BANKS.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
            <SelectItem value={OTHER_OPTION}>Other (type manually)</SelectItem>
          </SelectContent>
        </Select>
        {bankSelection === OTHER_OPTION && (
          <Input
            placeholder="Enter bank name"
            value={customBankName}
            onChange={(e) => setCustomBankName(e.target.value)}
          />
        )}
        <Input
          inputMode="numeric"
          maxLength={10}
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <Input
          placeholder="Account name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button size="sm" disabled={isSaving} onClick={handleSave}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
