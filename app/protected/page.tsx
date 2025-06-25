import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 h-screen items-center justify-center">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          You are logged in as Equilibrium
        </div>
      </div>
      <div>
      <div className="flex flex-col gap-6">
        <h1 className="text-9xl font-semibold ">Welcome to Equilibrium</h1>
        <button className="text-foreground px-4 py-2 rounded-md bg-primary hover:bg-secondary/80 transition-colors">
          <Link href="/dashboard" className="">Go to Dashboard</Link>    
          </button>   
      </div>
      </div>
    </div>
  );
}
