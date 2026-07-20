"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { OrderForm } from "./OrderWizard";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type AccountAccessConsentProps = {
  form: OrderForm;
};

type FieldErrorItem = { message?: string } | string | undefined;

function normalizeErrors(errors: FieldErrorItem[]) {
  return errors.map((e) => (typeof e === "string" ? { message: e } : e));
}

export function AccountAccessConsent({ form }: AccountAccessConsentProps) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  function togglePasswordVisibility() {
    setPasswordVisibility((prev) => !prev);
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-medium">Account Access</p>
      <p className="mt-1 text-sm text-muted-foreground">
        To complete this order, the owner will log into your game account
        directly using the email and password you provide below, this is how
        top-ups are delivered for this service.
      </p>

      <form.Field name="accountAccessConsent">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && field.state.meta.errors.length > 0;

          return (
            <>
              <Field
                orientation="horizontal"
                className="mt-3"
                data-invalid={isInvalid || undefined}
              >
                <Checkbox
                  id="account-access-consent"
                  checked={field.state.value}
                  onCheckedChange={(checked: boolean) =>
                    field.handleChange(checked === true)
                  }
                />
                <FieldLabel
                  htmlFor="account-access-consent"
                  className="font-normal"
                >
                  I understand and agree to provide my account login for this
                  order.
                </FieldLabel>
              </Field>
              {isInvalid && (
                <FieldError
                  className="mt-2 text-xs"
                  errors={normalizeErrors(field.state.meta.errors)}
                />
              )}

              {field.state.value && (
                <div className="mt-4 flex flex-col gap-4">
                  <form.Field name="gameAccountEmail">
                    {(emailField) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid || undefined}>
                          <FieldLabel htmlFor="game-account-email">
                            Account email
                          </FieldLabel>
                          <Input
                            id="game-account-email"
                            type="email"
                            value={emailField.state.value}
                            onChange={(e) =>
                              emailField.handleChange(e.target.value)
                            }
                          />
                          {isInvalid && (
                            <FieldError
                              errors={normalizeErrors(
                                emailField.state.meta.errors,
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="gameAccountPassword">
                    {(passwordField) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;

                      return (
                        <Field data-invalid={isInvalid || undefined}>
                          <FieldLabel htmlFor="game-account-password">
                            Account password
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id="game-account-password"
                              type={passwordVisibility ? "text" : "password"}
                              autoComplete="off"
                              value={passwordField.state.value}
                              onChange={(e) =>
                                passwordField.handleChange(e.target.value)
                              }
                            />
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                aria-label="show password"
                                onClick={togglePasswordVisibility}
                              >
                                {passwordVisibility ? (
                                  <EyeClosed className="size-5" />
                                ) : (
                                  <Eye className="size-5" />
                                )}
                              </InputGroupButton>
                            </InputGroupAddon>
                          </InputGroup>
                          {isInvalid && (
                            <FieldError
                              errors={normalizeErrors(
                                passwordField.state.meta.errors,
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
              )}
            </>
          );
        }}
      </form.Field>
    </div>
  );
}
