import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Identicon from "./IdentIcon";
import { ethers } from "ethers";
import styles from "../header/style/Header.module.css";
import { useWalletContext } from "../../context/wallet";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getProvider } from "../pool/contract/poolContract";
const style = {
  position: "absolute",
  top: 96,
  right: 0,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid transparent",
  p: 2,
};

export default function AccountModal({ setAccountModalOpen }) {
  const provider = getProvider();
  const handleOpen = () => setAccountModalOpen(true);
  const handleClose = () => setAccountModalOpen(false);
  const { account } = useWalletContext();
  const [ethBalance, setEthBalance] = useState(0);
  useEffect(() => {
    async function fetchUserWalletETHBalance() {
      const balance = await provider.getBalance(account);
      setEthBalance(ethers.utils.formatEther(balance));
    }

    fetchUserWalletETHBalance();
  });

  const copy = () => {
    navigator.clipboard.writeText(account);
  };

  const logout = async () => {
    const res = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [{ eth_accounts: {} }],
    });
    console.log(res);
  };

  return (
    <div>
      <Modal open={true} onClose={handleClose}>
        <Box sx={style}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Identicon />
            <p className={styles.accountAddress}>
              {account.slice(0, 5) + "..." + account.slice(-4)}
            </p>
            <button className={styles.smallButton} onClick={copy}>
              <ContentCopyIcon className={styles.smallIcon} />
            </button>
            <button className={styles.smallButton} onClick={logout}>
              <PowerSettingsNewIcon className={styles.smallIcon} />
            </button>
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ETH Balance: {ethBalance}
          </Typography>
          <Button
            sx={{ marginTop: 2, height: 60 }}
            variant="contained"
            size="large"
            fullWidth
          >
            View and Sell NFT/TOKEN <ChevronRightIcon />
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
