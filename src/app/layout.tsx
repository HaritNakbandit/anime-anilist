import React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import PageLayout from "@/components/layout/PageLayout";
import { ApolloProviderWrapper } from "../lib/apolloWrapper";
import Theme from "@/theme/Theme";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/app-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <head>
        {/* Apply saved theme before hydration so the first paint matches React state. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
        {/* Hide the splash screen before first paint on repeat visits this session,
            via CSS rather than React state, so there's no hydration-mismatch flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("animeAnilist:splashSeen")){document.documentElement.classList.add("splash-seen")}}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-navy-light text-navy-textPrimary antialiased dark:bg-navyDark-bg dark:text-navyDark-textPrimary">
        <ApolloProviderWrapper>
          <Theme>
            <Suspense fallback={<div className="flex h-screen items-center justify-center bg-navy-light dark:bg-navyDark-bg text-navy-primary dark:text-navyDark-primary">Loading...</div>}>
              <PageLayout>{children}</PageLayout>
            </Suspense>
          </Theme>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}