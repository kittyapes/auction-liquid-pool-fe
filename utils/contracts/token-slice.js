import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import { RPC_URL } from "../constants";
import erc20Abi from "../abis/erc20.json";
import mtokenAbi from "../abis/mtoken.json";

const staticProvider = new JsonRpcProvider(RPC_URL);

export const getTokenInfo = async (token) => {
  const contract = new Contract(token, erc20Abi, staticProvider);
  const decimals = await contract.decimals();
  const symbol = await contract.symbol();
  const name = await contract.name();
  return new Token(ChainId.GÖRLI, token, decimals, symbol, name);
};

export const getAllowance = async (token, account, operator) => {
  const contract = new Contract(token, erc20Abi, staticProvider);
  return await contract["allowance"](account, operator);
};

export const increaseAllowance = (provider, token, operator, amount) => {
  const contract = new Contract(token, erc20Abi, provider.getSigner());
  return contract["increaseAllowance"](operator, amount);
};

export const approveToken = (provider, token, operator, amount) => {
  const contract = new Contract(token, erc20Abi, provider.getSigner());
  return contract["approve"](operator, amount);
};

export const getUniswapPair = async (token) => {
  const contract = new Contract(token, mtokenAbi, staticProvider);
  return await contract["uniswapPool"]();
};

export const getUniswapTokenContract = (token) =>
  new Contract(token, erc20Abi, staticProvider);
