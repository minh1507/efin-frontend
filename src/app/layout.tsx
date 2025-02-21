"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dynamic/app-sidebar";
import { Header } from "@/components/dynamic/header";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

const ThemeProvider = dynamic(
  () => import("@/components/dynamic/theme-provider").then((mod) => mod.ThemeProvider),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth"); 

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {isAuthPage ? (
          <>{children}</>
        ) : (
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1">
                <Header />
                <div className="p-4">{children}</div>
              </main>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
