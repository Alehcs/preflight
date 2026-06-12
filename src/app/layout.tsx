import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

// Pendo (Novus) bootstrap snippet — queues calls until the SDK loads from CDN.
// Each anonymous visitor gets a stable random ID stored in localStorage so
// Pendo can count unique visitors and attribute track events correctly.
// Using the literal string 'anonymous' as the visitor id causes Pendo to
// suppress all page-view and event attribution.
const pendoSnippet = novusKey
  ? `(function(apiKey){var vid;try{var k='_pf_vid';vid=localStorage.getItem(k);if(!vid){vid='anon-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);localStorage.setItem(k,vid);}}catch(e){vid='anon-'+Math.random().toString(36).slice(2);}(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');pendo.initialize({visitor:{id:vid}});})(\'${novusKey}\');`
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
        <Script
          id="novus-pendo"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: pendoSnippet }}
        />
      )}
    </html>
  );
}
