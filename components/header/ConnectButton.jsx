import React from "react";
import { useWalletContext } from "../../context/wallet";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Identicon from "./IdentIcon";
import styles from "../header/style/Header.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const ConnectButton = ({ handleOpenModal }) => {
  const { account, pendingTxs } = useWalletContext();
  return account ? (
    pendingTxs.size != 0 ? (
      <button
        className={styles.ConnectButton}
        style={{ display: "flex" }}
        onClick={handleOpenModal}
      >
        <CircularProgress sx={{ p: 1 }} size={40} />{" "}
        <span>Transaction Pending...</span>
      </button>
    ) : (
      <button className={styles.ConnectButton} onClick={handleOpenModal}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Identicon />
          <p className={styles.accountAddress}>
            {account.slice(0, 5) + "..." + account.slice(-4)}
          </p>
          <KeyboardArrowDownIcon />
        </div>
      </button>
    )
  ) : (
    <button>Connect to a wallet</button>
  );
};

export default ConnectButton;
