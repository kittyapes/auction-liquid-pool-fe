import React, { useContext, useEffect, useState } from "react";

const WalletContext = React.createContext(undefined);

WalletContext.displayName = "WalletContext";

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("__HYPEX_walletAddress", walletAddress);
    }
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
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
