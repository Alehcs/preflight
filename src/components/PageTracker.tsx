"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/novus";

export default function PageTracker({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: Record<string, unknown>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(eventName, properties);
  }, [eventName, properties]);
  return null;
}
