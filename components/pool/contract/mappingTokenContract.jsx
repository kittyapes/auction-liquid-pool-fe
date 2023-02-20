import Web3 from "web3";
import tokenAbi from "./mappingTokenAbi.json";

const getContract = (address) => {
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(tokenAbi, address);
};

export const getUniswapPairAddress = async (mappingTokenAddress) => {
  const contract = getContract(mappingTokenAddress);
  return await contract.methods.uniswapPool().call();
};

export const getAllowance = async (
  account,
  nftPoolAddress,
  mappingTokenAddress
) => {
  return await getContract(mappingTokenAddress)
    .methods.allowance(account, nftPoolAddress)
    .call();
};

// Takes in nft pool address.
export const mappingTokenInfo = async (address) => {
  const contract = getContract(address);
  const mappingTokenAddress = await contract.methods.mappingToken().call();
  return mappingTokenAddress;
};

export const increaseAllowance = (
  account,
  nftPoolAddress,
  mappingTokenAddress
) => {
  getContract(mappingTokenAddress)
    .methods.increaseAllowance(account, nftPoolAddress)
    .send({
      from: account,
      type: "0x2",
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });
};
