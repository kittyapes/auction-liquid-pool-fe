import React, { useEffect, useState, useRef } from "react";
import HypexLogo from "../../static/images/logo.png";
import styles from "../header/style/Header.module.css";
import { connectWallet } from "../Wallet/connectors";
import { useRouter } from "next/router";
import { useChainId, checkChainId } from "../../api/contract";
import { useWalletContext } from "../../context/wallet";
import { ethers } from "ethers";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import { getProvider } from "../pool/contract/poolContract";
if (typeof window !== "undefined") {
  var jazzicon = require("jazzicon");
}
const Header = () => {
  const router = useRouter();
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const {
    account,
    setAccount,
    pendingTxs,
    setPendingTxs,
    chainId,
    setChainId,
  } = useWalletContext();
  const useToHome = () => {
    router.push("/");
  };
  const clickConnectButton = () => {
    console.log(accountModalOpen);
    setAccountModalOpen(true);
  };
  useEffect(() => {
    async function connect() {
      const address = await connectWallet();
      setAccount(address);
    }
    if (account == null) {
      connect();
    }
    checkChainId(setChainId);
  });

  useEffect(() => {
    if (account != null) {
      window.ethereum.on("networkChanged", function (networkId) {
        if (chainId != networkId) {
          setChainId(networkId);
        }
      });
    }
  }, [account]);

  useEffect(() => {
    console.log(pendingTxs);
  }, [pendingTxs]);

  console.log("from header");
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo} onClick={useToHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </div>
      </div>
      {account && (
        <div className={styles.right}>
          <ConnectButton handleOpenModal={clickConnectButton} />
          {accountModalOpen && (
            <AccountModal setAccountModalOpen={setAccountModalOpen} />
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
