
const baseAddress = "0x236F15243BF5750e491a1B41649251268e240DcC";
import { ethers } from "ethers";
import Web3 from "web3";
import tokenAbi from "./mappingTokenAbi.json";

const getTokenContract = () => {
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(tokenAbi, baseAddress);
  };

export const getAllowance = (account) => {
    const spender = "0x69a8fB7aB0672693C70a4a4DC31f51fCb22258Fb"
    return getTokenContract().methods.allowance(account, spender).call();
};

export const increaseAllowance = (account) => {
    const spender = "0x69a8fB7aB0672693C70a4a4DC31f51fCb22258Fb"
    return getTokenContract().methods.increaseAllowance(account, spender).send({
        from: account,
        type: "0x2",
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });
};