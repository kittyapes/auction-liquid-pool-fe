const gql = require("graphql-tag");

export const POOLS_QUERY = gql`
  {
    pools(first: 1000) {
      id
      owner {
        id
      }
      nft
      mappingToken
      tokenIds
      createdDate
      lockPeriod
      duration
      isLinear
      delta
      ratio
      randomFee
      tradingFee
      startPrice
      feeTypes
      feeValues
    }
  }
`;
