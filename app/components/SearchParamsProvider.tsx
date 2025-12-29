"use client";

import React, { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";

const SearchParamsContext = createContext<URLSearchParams | null>(null);

export function SearchParamsProvider({ children }: { children: React.ReactNode }) {
  const search = useSearchParams();
  return <SearchParamsContext.Provider value={search}>{children}</SearchParamsContext.Provider>;
}

export function useSearchParamsContext() {
  const ctx = useContext(SearchParamsContext);
  if (ctx === null) {
    throw new Error("useSearchParamsContext must be used within a SearchParamsProvider");
  }
  return ctx;
}

export default SearchParamsProvider;
