const { InMemoryCache } = require("apollo-cache-inmemory");
const { ApolloClient } = require("apollo-client");
const { createHttpLink } = require("apollo-link-http");

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/defigods/auction-liquid",
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const fetchFromGraph = async (query, key) => {
  try {
    const result = await client.query({
      query,
      fetchPolicy: "cache-first",
    });
    return result.data[key];
  } catch (e) {
    console.error("graph query error", query, e);
    return [];
  }
};
