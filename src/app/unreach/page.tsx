"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-8xl font-extrabold">404</h1>

      <p className="mt-2 text-lg text-muted-foreground text-center">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link href="/">
        <Button className="mt-6">Go Back Home</Button>
      </Link>
    </div>
  );
}
