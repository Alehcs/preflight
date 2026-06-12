// Novus is a Pendo-powered product agent (novus.pendo.io).
// Setup: connect your repo at novus.pendo.io — Novus scans your codebase and
// submits a PR with instrumentation. Set NEXT_PUBLIC_NOVUS_API_KEY (your Pendo
// subscription key) and the Pendo script is injected in layout.tsx automatically.
//
// Once the Pendo script loads, window.pendo is available and trackEvent() forwards
// calls to pendo.track(). Without the key, events are console.debug-only in dev
// and silently no-op in production. The app never crashes due to analytics.

declare global {
  interface Window {
    pendo?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void;
      initialize: (options: Record<string, unknown>) => void;
      pageLoad?: () => void;
    };
  }
}

const isDev = process.env.NODE_ENV === "development";

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  try {
    if (typeof window !== "undefined" && window.pendo?.track) {
      window.pendo.track(eventName, properties);
      return;
    }
  } catch {
    // never surface analytics errors to users
  }

  if (isDev) {
    console.debug("[preflight:novus]", eventName, properties ?? "");
  }
}
