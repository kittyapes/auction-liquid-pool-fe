const baseAddress = "0x9117808F6ebEAeaE94DBcC2255C13db607f00F22";
export const dexTokenAddress = "0x334E2D204EaF5EF89F0AD7b4DaC167Bf8Fcc752e";
import tokenAbi from "./poolContractAbi.json";
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

const getTokenContract = () => {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(tokenAbi, baseAddress);
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

export const getTokenIds = () => {
  return getTokenContract().methods.getTokenIds().call();
};

export const redeemNFT = (account, amount) => {
  return getTokenContract().methods.redeem(amount).send({
    from: account,
    type: "0x2",
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  });
};

export const placeBid = (tokenId, account) => {
  return getTokenContract().methods.bid(tokenId).send({
    from: account,
    type: "0x2",
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  });
};

export const randomSwap = (tokenId, account) => {
  return getTokenContract().methods.swap(tokenId).send({
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
