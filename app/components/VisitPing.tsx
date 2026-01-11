"use client";

import { useEffect } from "react";

export default function VisitPing() {
  useEffect(() => {
    // fire-and-forget: inform server of a site visit
    fetch("/api/stats/visit", { method: "POST" }).catch((e) => {
      // ignore errors
      console.debug("Visit ping failed:", e);
    });
  }, []);

  return null;
}
