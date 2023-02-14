import { ethers } from "ethers";
import Web3 from "web3";
import tokenAbi from "./mappingTokenAbi.json";

const getContract = (address) => {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(tokenAbi, address);
};

export const getAllowance = (account, nftPoolAddress, mappingTokenAddress) => {
  return getContract(mappingTokenAddress)
    .methods.allowance(account, nftPoolAddress)
    .call();
};

export const increaseAllowance = (
  account,
  nftPoolAddress,
  mappingTokenAddress
) => {
  return getContract(mappingTokenAddress)
    .methods.increaseAllowance(account, nftPoolAddress)
    .send({
      from: account,
      type: "0x2",
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });
};
