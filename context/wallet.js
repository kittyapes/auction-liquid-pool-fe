import React, { useContext, useEffect, useState } from "react";

const WalletContext = React.createContext(undefined);

WalletContext.displayName = "WalletContext";

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [pendingTxs, setPendingTxs] = useState(new Set([]));

  useEffect(() => {
    if (account) {
      localStorage.setItem("__HYPEX_walletAddress", account);
    }
  }, [account]);

  return (
    <WalletContext.Provider
      value={{
        account,
        setAccount,
        pendingTxs,
        setPendingTxs,
        chainId,
        setChainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWalletContext() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("Cannot Use without WalletProvider");
  }

  return context;
}
