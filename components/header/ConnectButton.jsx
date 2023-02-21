import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import AccountModal from "./AccountModal";
import { useWeb3Context } from "../../utils/web3-context";
import Identicon from "./IdentIcon";
import styles from "../header/style/Header.module.css";

const ConnectButton = () => {
  const { account, connect, pendingTxs } = useWeb3Context();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {account.length > 0 ? (
        pendingTxs.size != 0 ? (
          <button
            className={styles.ConnectButton}
            style={{ display: "flex" }}
            onClick={() => setOpenModal(true)}
          >
            <CircularProgress sx={{ p: 1 }} size={40} />{" "}
            <span>Transactions Pending...</span>
          </button>
        ) : (
          <button
            className={styles.ConnectButton}
            onClick={() => setOpenModal(true)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Identicon />
              <p className={styles.accountAddress}>
                {account.slice(0, 5) + "..." + account.slice(-4)}
              </p>
              <KeyboardArrowDown />
            </div>
          </button>
        )
      ) : (
        <button className={styles.ConnectButton} onClick={connect}>
          Connect to your wallet
        </button>
      )}
      <AccountModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default ConnectButton;
