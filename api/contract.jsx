export const useChainId = async () => {
  const _chainId = await window.ethereum.request({ method: "eth_chainId" });
  const chainId = _chainId.replace("0x", "");
  return chainId;
};
