const baseAddress = "0xb101C011B562f9114F5e31EED49784CecD1fEA77";
import tokenAbi from "./token.json";
import Web3 from "web3";
const getTokenContract = () => {
    const web3 = new Web3(window.ethereum);
      return new web3.eth.Contract(
        tokenAbi,
        baseAddress
      );
}

export const randomRedeem = async(amount)=>{
  return getTokenContract().methods.redeem(amount);
}

export const swap = async(tokenId)=>{
  return getTokenContract().methods.swap(tokenId);
}

export const startAuction = async (tokenId)=>{
    return getTokenContract().methods.startAuction(tokenId);
}

export const placeBid = async(tokenId,account)=>{
  return getTokenContract().methods.bid(tokenId).send({
    from: account,
    type: "0x2",
    maxFeePerGas: "50000000000",
    maxPriorityFeePerGas: "2000000000",
  });;
}
