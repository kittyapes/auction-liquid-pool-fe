import tokenAbi from "./poolContractAbi.json";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import Web3 from "web3";
import JSBI from "jsbi";
import { ChainId, Token, Fetcher, Route } from "@uniswap/sdk";

const browserExtensionProvider = createBrowserExtensionProvider();
export const V3_SWAP_ROUTER_ADDRESS =
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

export const V2_SWAP_ROUTER_ADDRESS =
  "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";

const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000;

const getNftPoolContract = (address) => {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(tokenAbi, address);
};

export const getMappingTokenAddress = async (nftPoolAddress) => {
  const contract = getNftPoolContract(nftPoolAddress);
  return await contract.methods.mappingToken().call();
};

export const getContract = (tokenAddress) => {
  return new ethers.Contract(tokenAddress, ERC20_ABI, browserExtensionProvider);
};

export const getTokenInfo = async (tokenAddress) => {
  const tokenContract = getContract(tokenAddress);
  const decimal = await tokenContract.decimals();
  const symbol = await tokenContract.symbol();
  return new Token(ChainId.GÖRLI, tokenAddress, decimal, symbol, symbol);
};

export const redeemNFT = async (account, nftPoolAddress, amount) => {
  return getNftPoolContract(nftPoolAddress).methods.redeem(amount).send({
    from: account,
    to: nftPoolAddress,
    type: "0x2",
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  });
};

export const placeBid = async (nftPoolAddress, bidAmount, tokenId, account) => {
  return getNftPoolContract(nftPoolAddress)
    .methods.bid(tokenId)
    .send({
      from: account,
      value: new BigNumber(bidAmount).times(Math.pow(10, 18)).times(1),
      type: "0x2",
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });
};

export const randomSwap = async (tokenId, account, nftPoolAddress) => {
  return getNftPoolContract(nftPoolAddress).methods.swap(tokenId).send({
    from: account,
    type: "0x2",
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  });
};

export const getUniswapTokenContract = (token) => {
  return new ethers.Contract(WETH.address, ERC20_ABI, browserExtensionProvider);
};

export function createBrowserExtensionProvider() {
  try {
    return new ethers.providers.Web3Provider(window.ethereum, "any");
  } catch (e) {
    console.log("No Wallet Extension Found");
    return null;
  }
}

export function getProvider() {
  //can be other provider.
  return browserExtensionProvider;
}

export const sendTransactionViaExtension = async (transaction) => {
  try {
    const receipt = await browserExtensionProvider?.send(
      "eth_sendTransaction",
      [transaction]
    );
    if (receipt) {
      return TransactionState.Sent;
    } else {
      return TransactionState.Failed;
    }
  } catch (e) {
    console.log(e);
    return TransactionState.Rejected;
  }
};
export const TransactionState = {
  Failed: "Failed",
  New: "New",
  Rejected: "Rejected",
  Sending: "Sending",
  Sent: "Sent",
};

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export async function getTokenTransferApproval(address, provider, token) {
  if (!provider || !address) {
    console.log("No Provider Found");
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );

    const transaction = await tokenContract.populateTransaction.approve(
      V3_SWAP_ROUTER_ADDRESS,
      fromReadableAmount(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
        token.decimals
      ).toString()
    );

    return sendTransactionViaExtension({
      ...transaction,
      from: address,
    });
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}

export function fromReadableAmount(amount, decimals) {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = amount * extraDigits;
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );
}

function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split(".")[1].length || 0;
}

export const MAX_FEE_PER_GAS = "50000000000";
export const MAX_PRIORITY_FEE_PER_GAS = "2000000000";

class Price {
  constructor(baseToken, quoteToken, denominator, numerator) {
    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    this.denominator = denominator;
    this.numerator = numerator;
  }
}

class Immutables {
  constructor(factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick) {
    this.factory = factory;
    this.token0 = token0;
    this.token1 = token1;
    this.fee = fee;
    this.tickSpacing = tickSpacing;
    this.maxLiquidityPerTick = maxLiquidityPerTick;
  }
}

class State {
  constructor(liquidity, slot) {
    this.liquidity = liquidity;
    this.sqrtPriceX96 = slot[0];
    this.tick = slot[1];
    this.observationIndex = slot[2];
    this.observationCardinality = slot[3];
    this.observationCardinalityNext = slot[4];
    this.feeProtocol = slot[5];
    this.unlocked = slot[6];
  }
}

export const API = {
  GetCollectionStats: async (collectionName) => {
    try {
      const options = { method: "GET", mode: "cors" };
      const res = await fetch(
        "https://testnets-api.opensea.io/api/v1/collection/opensea-creature",
        options
      );
      const data = await res.json();
      if (res.status !== 200 && res.status !== 201) {
        return { isSuccessful: false, data: null, message: res.statusText };
      }

      return { isSuccessful: true, data: data, message: "successfulMessage" };
    } catch (err) {
      return { isSuccessful: false, data: null, message: "Unknown Error" };
    }
  },
};

export const getWebSocket = () =>
  new ethers.providers.WebSocketProvider(
    "wss://goerli.infura.io/ws/v3/8d5bc85320a64c5ca0e25c4ce8d8120e"
  );

export const fetchNFTTokenIdsFromPoolAddress = async (poolAddress) => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(tokenAbi, poolAddress);
  const tokenIds = await contract.methods.getTokenIds().call();
  return tokenIds;
};

export const fetchNFTAuctionInfoFromTokenId = async (poolAddress, tokenId) => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(tokenAbi, poolAddress);
  const nftAuctionInfo = await contract.methods.auctions(tokenId).call();
  return nftAuctionInfo;
};

export const fetchPoolInfo = async (poolAddress) => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(tokenAbi, poolAddress);
  console.log(poolAddress);
  console.log(contract);
  const duration = await contract.methods.duration().call();
  const isLinear = await contract.methods.isLinear().call();
  let delta;
  let ratio;
  if (isLinear) {
    delta = await contract.methods.delta().call();
  } else {
    ratio = await contract.methods.ratio().call();
  }

  return {
    address: poolAddress,
    duration: duration,
    isLinear: isLinear,
    delta: delta,
    ratio: ratio,
  };
};

export const getTransactionStatus = async (transactionHash, callback) => {
  const provider = getWebSocket();
  var isDone = false;
  while (!isDone) {
    await new Promise((r) => setTimeout(r, 2000));
    let pendingTx = await provider.getTransactionReceipt(transactionHash);
    if (pendingTx) {
      isDone = true;
      await callback();
    }
  }
};
