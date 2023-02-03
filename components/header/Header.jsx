import React, { useEffect, useState, useRef } from "react";
import HypexLogo from "../../static/images/logo.png";
import styles from "../header/style/Header.module.css";
import { connectWallet } from "../Wallet/connectors";
import { useRouter } from "next/router";
import { useChainId } from "../../api/contract";
import { useWalletContext } from "../../context/wallet";
import { ethers } from "ethers";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
if (typeof window !== "undefined") {
  var jazzicon = require("jazzicon");
}
const Header = () => {
  const router = useRouter();
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const { account, setAccount } = useWalletContext();
  const useToHome = () => {
    router.push("/");
  };
  console.log(`account:${account}`);
  const clickConnectButton = () => {
    console.log(accountModalOpen);
    setAccountModalOpen(true);
  };
  useEffect(() => {
    async function connect() {
      const address = await connectWallet();
      setAccount(address);
    }
    if (account != null) return;
    connect();
  });
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
