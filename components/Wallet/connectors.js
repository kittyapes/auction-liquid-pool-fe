import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";

export const connectWallet = async () => {
  const provider = new ethers.providers.Web3Provider(
    window["ethereum"] || window.web3.currentProvider
  );
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  console.log("here??");
  const walletAddress = await signer.getAddress();
  return walletAddress;
};

export const injected = new InjectedConnector({
  // Change to [1] when push to prod.
  supportedChainIds: [1, 5],
});
