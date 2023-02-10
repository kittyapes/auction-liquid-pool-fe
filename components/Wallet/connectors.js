import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window["ethereum"] && (!window.web3 || !window.web3.currentProvider)) {
    console.log("no web3 access!!");
    return;
  }
  const provider = new ethers.providers.Web3Provider(
    window["ethereum"] || window.web3.currentProvider
  );
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  console.log(walletAddress);
  return walletAddress;
};

export const readWallet = async () => {
  if (!window["ethereum"] && (!window.web3 || !window.web3.currentProvider)) {
    console.log("no web3 access!!");
    return null;
  }
  const provider = new ethers.providers.Web3Provider(
    window["ethereum"] || window.web3.currentProvider
  );
  const signer = provider.getSigner();
  try {
    const walletAddress = await signer.getAddress();
    return walletAddress;
  } catch (e) {
    return null;
  }
};

export const injected = new InjectedConnector({
  // Change to [1] when push to prod.
  supportedChainIds: [1, 5],
});
