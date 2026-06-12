"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PendoPageTracker() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    try {
      window.pendo?.pageLoad?.();
    } catch {
      // Analytics must never interrupt navigation.
    }
  }, [pathname]);

  return null;
}
