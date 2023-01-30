import React, { useEffect, useState, useRef } from "react";
import HypexLogo from "../../static/images/logo.png";
import styles from "../header/style/Header.module.css";
import { connectWallet } from "../Wallet/connectors";
import { useRouter } from "next/router";
import { useChainId } from "../../api/contract";
import { useWalletContext } from "../../context/wallet";
import { ethers } from "ethers";
if (typeof window !== "undefined") {
  var jazzicon = require("jazzicon");
}
const Header = () => {
  const router = useRouter();
  const avatarRef = useRef();
  const { account, setAccount } = useWalletContext();
  const useToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    async function connect() {
      const address = await connectWallet();
      setAccount(address);
    }
    if (account != null) return;
    connect();
  });

  useEffect(() => {
    if (!account) return;
    const element = avatarRef.current;
    if (element && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(20, seed); //generates a size 20 icon
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  }, [account, avatarRef]);
  const abbreviateWalletAddress = (address) => {
    return address.slice(0, 5) + "..." + address.slice(-4);
  };
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo} onClick={useToHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </div>
      </div>
      {account && (
        <div className={styles.right}>
          <div ref={avatarRef}></div>
          <div>{abbreviateWalletAddress(account)}</div>
        </div>
      )}
    </div>
  );
};

export default Header;
