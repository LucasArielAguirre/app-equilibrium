import Link from "next/link";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center w-full h-screen justify-center">
      <p className="text-7xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center content-center flex flex-row gap-4 justify-center  items-center font-mono">
        Equilibrium your first app in economy{" "}
        <img src="https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFua3xlbnwwfHwwfHx8MA%3D%3D" alt="" />
      </p>
  
      <h2 className="text-xl font-mono">You need loggin for using this app</h2>
      <div className="flex gap-2 top-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
    </div>
  );
}
