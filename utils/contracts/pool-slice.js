import { Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { fetchFromGraph } from "../graphql/client";
import {
  AUCTION_QUERY,
  POOLS_QUERY,
  POOL_QUERY,
  SWAPS_QUERY,
} from "../graphql/queries";
import { RPC_URL } from "../constants";
import poolAbi from "../abis/pool.json";
import { useEffect, useState } from "react";

const staticProvider = new JsonRpcProvider(RPC_URL);

export const getMappingTokenAddress = async (pool) => {
  const contract = new Contract(pool, poolAbi, staticProvider);
  return await contract["mappingToken"]();
};

export const getTokenIdsFromPool = async (pool) => {
  const contract = new Contract(pool, poolAbi, staticProvider);
  return await contract["getTokenIds"]();
};

export const getAuctionByTokenId = async (pool, tokenId) => {
  const contract = new Contract(pool, poolAbi, staticProvider);
  return await contract["auctions"](tokenId);
};

const getNFTPoolContract = (provider, pool) =>
  new Contract(pool, poolAbi, provider.getSigner());

export const redeemNFT = (provider, pool, count) =>
  getNFTPoolContract(provider, pool)["redeem"](count);

export const placeBid = (provider, pool, tokenId) =>
  getNFTPoolContract(provider, pool)["bid"](tokenId);

export const swapNFT = async (provider, pool, tokenId) =>
  getNFTPoolContract(provider, pool)["swap"](tokenId);

export const getPoolInfo = async (pool) => {
  const data = await fetchFromGraph(POOL_QUERY, { pool }, "pools");
  console.log("pool info", data);
  return data.length > 0 ? data[0] : {};
};

export const usePools = () => {
  const [data, setData] = useState([]);
  const [tick, setTick] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 10000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchFromGraph(POOLS_QUERY, {}, "pools");
      setData(result);
      setLoading(false);
    };

    fetch();
  }, [tick]);

  return { data, isLoading };
};

export const usePool = (pool) => {
  const [data, setData] = useState(null);
  const [tick, setTick] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 10000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchFromGraph(POOL_QUERY, { pool }, "pools");
      setData(result[0]);
      setLoading(false);
    };

    fetch();
  }, [tick]);

  return { data, isLoading };
};

export const useAuction = (pool, tokenId) => {
  const [data, setData] = useState(null);
  const [tick, setTick] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 10000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchFromGraph(
        AUCTION_QUERY,
        { auctionId: `${pool}::${tokenId}` },
        "auctions"
      );
      setData(result.length > 0 ? result[0] : null);
      setLoading(false);
    };

    fetch();
  }, [tick]);

  return { data, isLoading };
};

export const useSwaps = (pool, account) => {
  const [data, setData] = useState([]);
  const [tick, setTick] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 10000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchFromGraph(
        SWAPS_QUERY,
        { pool, account },
        "swaps"
      );
      setData(result);
      setLoading(false);
    };

    fetch();
  }, [tick]);

  return { data, isLoading };
};

export const getTxStatus = async (txHash, callback) => {
  var isDone = false;
  while (!isDone) {
    await new Promise((r) => setTimeout(r, 2000));
    let pendingTx = await staticProvider.getTransactionReceipt(txHash);
    if (pendingTx) {
      isDone = true;
      await callback();
    }
  }
};

/* 
export const API = {
  GetCollectionStats: async (collection) => {
    try {
      const options = { method: "GET", mode: "cors" };
      const res = await fetch(
        "https://testnets-api.opensea.io/api/v1/collection/opensea-creature",
        options
      );
      const data = await res.json();
      if (res.status !== 200 && res.status !== 201) {
        return { success: false, data: null, message: res.statusText };
      }

      return { success: true, data: data, message: "fetched collections" };
    } catch (err) {
      return { success: false, data: null, message: "unknown error" };
    }
  },
};
 */
