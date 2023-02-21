import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/defigods/auction-liquid",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const fetchFromGraph = async (query, variables, key) => {
  try {
    const result = await client.query({
      query,
      variables,
      fetchPolicy: "cache-first",
    });
    return result.data[key];
  } catch (e) {
    console.error("graph query error", query, e);
    return [];
  }
};
