import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3Modal from "web3modal";
import * as UAuthWeb3Modal from "@uauth/web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { GOERLI_CHAIN } from "../utils/constants";

const Web3Context = createContext(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [onChainProvider]);
};

export const Web3ContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(5);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [pendingTxs, setPendingTxs] = useState(new Set([]));

  const [web3Modal, setWeb3Modal] = useState();

  useEffect(() => {
    if (typeof window !== "undefined")
      setWeb3Modal(
        new Web3Modal({
          cacheProvider: true,
          providerOptions: { connector: UAuthWeb3Modal.connector },
        })
      );
  }, [typeof window]);

  useEffect(() => {
    const isConnected = window.localStorage.getItem("connected");
    if (isConnected && web3Modal) connect();
  }, [web3Modal]);

  const hasCachedProvider = useCallback(() => {
    if (!web3Modal) return false;
    UAuthWeb3Modal.registerWeb3Modal(web3Modal);
    return !!web3Modal.cachedProvider;
  }, [web3Modal]);

  const switchToTargetChain = async () => {
    const chainId = "0x5"; // DEFAULT CHAIN ID - Goerli (test)
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      return true;
    } catch (e) {
      if (e.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [GOERLI_CHAIN],
          });
          return true;
        } catch (addError) {
          console.error(addError);
          return false;
        }
      } else {
        console.error(e);
        return false;
      }
    }
  };

  const disconnect = useCallback(async () => {
    setConnected(false);
    window.localStorage.setItem("connected", false);
    setTimeout(() => window.location.reload(), 1);

    if (!web3Modal) return;
    web3Modal.clearCachedProvider();
  }, []);

  const _initListeners = useCallback(
    (rawProvider) => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async () => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (chain) => {
        let newChainId;
        // On mobile chain comes in as a number but on web it comes in as a hex string
        if (typeof chain === "number") {
          newChainId = chain;
        } else {
          newChainId = parseInt(chain, 16);
        }
        setChainId(newChainId);
        if (newChainId !== 5) await disconnect();
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork, oldNetwork) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [disconnect]
  );

  const connect = useCallback(async () => {
    if (!web3Modal) return;
    try {
      const rawProvider = await web3Modal.connect();

      _initListeners(rawProvider);
      const connectedProvider = new Web3Provider(rawProvider, "any");
      const chainId = await connectedProvider
        .getNetwork()
        .then((network) => network.chainId);
      const connectedAddress = await connectedProvider.getSigner().getAddress();

      if (chainId !== 5) {
        const switched = await switchToTargetChain();
        if (!switched) {
          web3Modal.clearCachedProvider();
          console.error(
            "Unable to connect. Please change network using provider."
          );
          return;
        }
      }

      setChainId(chainId);
      setAccount(connectedAddress);
      setProvider(connectedProvider);
      setConnected(true);
      window.localStorage.setItem("connected", true);
      return connectedProvider;
    } catch (e) {
      console.error(e);
    }
  }, [_initListeners, web3Modal]);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      provider,
      connected,
      account,
      chainId,
      web3Modal,
      hasCachedProvider,
      pendingTxs,
      setPendingTxs,
    }),
    [
      connect,
      disconnect,
      provider,
      connected,
      account,
      chainId,
      web3Modal,
      hasCachedProvider,
      pendingTxs,
      setPendingTxs,
    ]
  );

  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
