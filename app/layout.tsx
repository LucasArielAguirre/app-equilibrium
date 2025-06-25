import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Welcome to Equilibrium",
  titleTemplate: "%s | Equilibrium",
  description: "Necesitas logearte para acceder a la aplicación",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className=" flex flex-col items-center  justify-between h-full w-full">
            <div className="w-full flex flex-col items-center h-full">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"} className="text-2xl text-primary" >Equilibrium</Link>
                  </div>
          
                </div>
                <div className="flex items-center justify-end w-full max-w-5xl p-3 px-5 gap-2">
                 {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                 <ThemeSwitcher /> 
                </div>
                 
              </nav>
              <div className=" w-full flex items-center justify-center align-middle m-auto h-full">
                {children}
              </div>
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 bottom-0">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Lucas Aguirre - EQUILIBRIUM TEAM
                  </a>
                </p>
                
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
