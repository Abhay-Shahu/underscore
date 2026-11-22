"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#0f0f11] border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center gap-5 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
          <AlertTriangle size={24} />
        </div>

        <div>
          <h2 className="text-xl font-serif text-stone-200">
            Something went wrong
          </h2>
          <p className="text-sm text-stone-400 font-light mt-1.5 leading-relaxed">
            An unexpected error occurred while loading this page. Please try refreshing or return to home.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full justify-center mt-2">
          <Button
            variant="gold"
            size="sm"
            onClick={() => reset()}
          >
            Try again
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
