import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import Script from "next/script";
import { ViewTransitions } from "@/components/view-transition";

export const metadata: Metadata = {
  title: "NextJS, TailWind, ShadCN Template",
  description:
    "This NextJS, TailWind, ShadCN Template.",
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "manifest", url: "/manifest.json" },
  ],
};

//Sets the browser toolbar color for mobile devices (theme-color meta tag).
export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body>
          {/* Google Tag Manager Script */}
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=GTM-NC4PFDL4'+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NC4PFDL4');
            `,
            }}
          />
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-NC4PFDL4"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
