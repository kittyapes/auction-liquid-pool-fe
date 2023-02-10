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
  const clickConnectButton = async () => {
    if (!account) {
      await connectWallet();
    } else {
      setAccountModalOpen(true);
    }
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts[0] == undefined) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    });
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

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo} onClick={useToHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </div>
      </div>
      <div className={styles.right}>
        <ConnectButton handleOnClick={clickConnectButton} />
        {accountModalOpen && (
          <AccountModal setAccountModalOpen={setAccountModalOpen} />
        )}
      </div>
    </div>
  );
};

export default Header;
