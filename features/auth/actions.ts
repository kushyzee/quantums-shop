"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "./schema";

type LoginResult =
  | { success: true }
  | {
      success: false;
      fieldErrors?: Partial<Record<"email" | "password", string[]>>;
      formError?: string;
    };

export async function login(input: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);
    return {
      success: false,
      fieldErrors: {
        email: tree.properties?.email?.errors,
        password: tree.properties?.password?.errors,
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "invalid_credentials") {
      return { success: false, formError: "Invalid email or password." };
    }

    console.error("Login error:", error.code, error.status);
    return {
      success: false,
      formError: "Something went wrong. Please try again.",
    };
  }

  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
