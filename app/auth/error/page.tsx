"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import SearchParamsProvider, { useSearchParamsContext } from "@/components/SearchParamsProvider";

function ErrorInner() {
  const search = useSearchParamsContext();
  const router = useRouter();
  const error = search?.get("error") || "unknown_error";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-lg zen-card p-8">
        <h1 className="text-2xl zen-title mb-2">Authentication Error</h1>
        <p className="mb-4">There was a problem with authentication: <strong>{error}</strong></p>
        <div className="flex gap-2">
          <button className="zen-button" onClick={() => router.push('/auth/login')}>Back to Login</button>
          <button className="zen-button" onClick={() => router.push('/')}>Go Home</button>
        </div>
      </main>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsProvider>
        <ErrorInner />
      </SearchParamsProvider>
    </Suspense>
  );
}
