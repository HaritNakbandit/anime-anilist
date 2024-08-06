import PageLayout from "@/components/layout/PageLayout";
import { ApolloWrapper } from "../lib/apolloWrapper";
import Theme from "@/theme/Theme";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        <ApolloWrapper>
          <Theme>
            <PageLayout>{children}</PageLayout>
          </Theme>
        </ApolloWrapper>
      </body>
    </html>
  );
}
