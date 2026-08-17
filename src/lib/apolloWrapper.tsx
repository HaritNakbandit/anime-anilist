"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { ApolloProvider } from "@apollo/client/react";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "https://graphql.anilist.co/",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

// Export the client factory for use in server components
export function getApolloClient() {
  return makeClient();
}

// Client component wrapper - renamed to avoid JSX conflicts
export const ApolloProviderWrapper = ({ children }: React.PropsWithChildren) => {
  const client = makeClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};