export const useChainId = async () => {
  if (!window["ethereum"] && (!window.web3 || !window.web3.currentProvider)) {
    console.log("no web3 access!!");
    return;
  }
  const _chainId = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = _chainId.replace("0x", "");
  return chainId;
};

export const checkChainId = async (setChainId) => {
  const _chainId = await useChainId();
  setChainId(_chainId);
  if (_chainId != 5) {
    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x5" }],
    });
    checkChainId(setChainId);
  }
};
