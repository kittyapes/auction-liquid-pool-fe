import React from "react";
import { useWalletContext } from "../../context/wallet";
import Identicon from "./IdentIcon";
import styles from "../header/style/Header.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ConnectButton = ({ handleOpenModal }) => {
  const { account } = useWalletContext();
  return account ? (
    <button className={styles.ConnectButton} onClick={handleOpenModal}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Identicon />
        <p className={styles.accountAddress}>
          {account.slice(0, 5) + "..." + account.slice(-4)}
        </p>
        <KeyboardArrowDownIcon />
      </div>
    </button>
  ) : (
    <button>Connect to a wallet</button>
  );
};

export default ConnectButton;
