import React from "react";
import { useRouter } from "next/router";
import ConnectButton from "./ConnectButton";
import HypexLogo from "../../static/images/logo.png";
import styles from "../header/style/Header.module.css";

const Header = () => {
  const router = useRouter();

  const goHome = () => router.push("/");

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logo} onClick={goHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </div>
      </div>
      <div className={styles.right}>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
