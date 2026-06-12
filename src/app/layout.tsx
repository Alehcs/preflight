import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import PendoPageTracker from "@/components/PendoPageTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Preflight — Before you build it, see what you're assuming.",
  description: "The pre-shipping checkpoint for AI builders.",
};

const novusKey = process.env.NEXT_PUBLIC_NOVUS_API_KEY;

// Pendo (Novus) bootstrap queues calls until the SDK loads from CDN. Identity is
// browser-scoped and stable across visits instead of collapsing into "anonymous".
const pendoSnippet = novusKey
  ? `(function(apiKey){(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');var storageKey='preflight_anonymous_id';var visitorId;var createId=function(){var value=window.crypto&&typeof window.crypto.randomUUID==='function'?window.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);return 'preflight-anon-'+value;};try{visitorId=window.localStorage.getItem(storageKey);if(!visitorId){visitorId=createId();window.localStorage.setItem(storageKey,visitorId);}}catch(error){visitorId=createId();}window.pendo.initialize({visitor:{id:visitorId,app:'preflight'},account:{id:'preflight-demo'}});window.pendo.pageLoad();})('${novusKey}');`
  : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {pendoSnippet && (
        <>
          <Script
            id="novus-pendo"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: pendoSnippet }}
          />
          <PendoPageTracker />
        </>
      )}
    </html>
  );
}
