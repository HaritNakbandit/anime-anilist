import { Suspense } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { ApolloWrapper } from "../lib/apolloWrapper";
import Theme from "@/theme/Theme";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <Theme>
            <Suspense>
              <PageLayout>{children}</PageLayout>
            </Suspense>
          </Theme>
        </ApolloWrapper>
      </body>
    </html>
  );
}
