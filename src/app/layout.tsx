import AppProvider from "@/lib/provider";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import Script from "next/script";
import { ViewTransitions } from "@/lib/view-transition/transition-context";

export const metadata: Metadata = {
  title: "NextJS, TailWind, ShadCN Template",
  description:
    "This NextJS, TailWind, ShadCN Template.",
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "manifest", url: "/manifest.json" },
  ],
  // For shared on Linkedin
  // openGraph: {
  //   url: "https://ui.shadcn.com/",
  //   type: "website",
  //   title: "NextJS, TailWind, ShadCN Template",
  //   description:
  //     "This NextJS, TailWind, ShadCN Template.",
  //   images: [
  //     {
  //       url: "https://opengraph.b-cdn.net/production/images/5f7de2ad-757c-4b5a-93df-e4710673ed92.png?token=icuAfsR9-MOAJY7LhwYLK25_qqRfozZ4PJh8hXq44PE&height=581&width=1200&expires=33280702307",
  //       width: 1200,
  //       height: 581,
  //       alt: "RedFlag Networks Open Graph Image",
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "RedFlag Networks | Flagging Workplace Culture & Crypto",
  //   description:
  //     "RedFlag Networks flags workplace toxicity, celebrates positive behavior, and explores workplace culture through crypto. Join our beta to redefine transparency and accountability.",
  //   images: [
  //     "https://opengraph.b-cdn.net/production/images/5f7de2ad-757c-4b5a-93df-e4710673ed92.png?token=icuAfsR9-MOAJY7LhwYLK25_qqRfozZ4PJh8hXq44PE&height=581&width=1200&expires=33280702307",
  //   ],
  // },
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
            <AppProvider>{children}</AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
