const baseAddress = "0x9117808F6ebEAeaE94DBcC2255C13db607f00F22";
import tokenAbi from "./poolContractAbi.json";
import Web3 from "web3";
const getTokenContract = () => {
    const web3 = new Web3(window.ethereum);
      return new web3.eth.Contract(
        tokenAbi,
        baseAddress
      );
}
export const getTokenIds = async()=>{
    return getTokenContract().methods.getTokenIds().call();
}

export const redeemNFT = async(account,amount)=>{
    return getTokenContract().methods.redeem(amount).send({
        from: account,
        type: "0x2",
        maxFeePerGas: "50000000000",
        maxPriorityFeePerGas: "2000000000",
      });
}

export const placeBid = async(tokenId,account)=>{
    return getTokenContract().methods.bid(tokenId).send({
      from: account,
      type: "0x2",
      maxFeePerGas: "50000000000",
      maxPriorityFeePerGas: "2000000000",
    });;
  }

  export const randomSwap = async(tokenId,account)=>{
    return getTokenContract().methods.swap(tokenId).send({
      from: account,
      type: "0x2",
      maxFeePerGas: "50000000000",
      maxPriorityFeePerGas: "2000000000",
    });;
  }