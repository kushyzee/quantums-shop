import { createClient } from "@/lib/supabase/server";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Logged in as {user?.email}
      </p>
      <form action={logout} className="mt-6">
        <Button type="submit" variant="outline">
          Log out
        </Button>
      </form>
    </main>
  );
}
