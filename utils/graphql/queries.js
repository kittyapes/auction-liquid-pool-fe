import gql from "graphql-tag";

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

export const POOL_QUERY = gql`
  query ($pool: String!) {
    pools(where: { id: $pool }) {
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

export const AUCTION_QUERY = gql`
  query Auction($auctionId: String!) {
    auctions(where: { id: $auctionId }) {
      starter {
        id
      }
      highestBid {
        account {
          id
        }
        amount
      }
      startAt
      expireAt
      isEnded
      bids(first: 100) {
        id
        account {
          id
        }
        amount
      }
    }
  }
`;

export const SWAPS_QUERY = gql`
  query Swaps($pool: String!, $account: String!) {
    swaps(where: { pool: $pool, account: $account }) {
      account {
        id
      }
      inTokenId
      outTokenId
      pool {
        id
      }
    }
  }
`;
