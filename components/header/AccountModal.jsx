import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Identicon from "./IdentIcon";
import { ethers } from "ethers";
import styles from "../header/style/Header.module.css";
import { useWalletContext } from "../../context/wallet";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getProvider } from "../pool/contract/poolContract";
const style = {
  position: "absolute",
  top: 96,
  right: 0,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid transparent",
  p: 2,
  borderRadius: 2,
};

export default function AccountModal({ setAccountModalOpen }) {
  const provider = getProvider();
  const handleOpen = () => setAccountModalOpen(true);
  const handleClose = () => setAccountModalOpen(false);
  const { account, pendingTxs } = useWalletContext();
  const [ethBalance, setEthBalance] = useState(0);
  const [copyLabel, setCopyLabel] = useState("copy");
  const formatFloatNumber = (x) => Number.parseFloat(x).toFixed(3);
  useEffect(() => {
    async function fetchUserWalletETHBalance() {
      const balance = await provider.getBalance(account);
      setEthBalance(formatFloatNumber(ethers.utils.formatEther(balance)));
    }

    fetchUserWalletETHBalance();
  });

  const copy = () => {
    navigator.clipboard.writeText(account);
    setCopyLabel("copied!");
  };

  const explore = () => {
    window.open(`https://goerli.etherscan.io/address/${account}`, "_blank");
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "30px",
                paddingBottom: "15px",
              }}
            >
              <Identicon />
              <p className={styles.accountModalText}>
                {account.slice(0, 5) + "..." + account.slice(-4)}
              </p>
            </div>
            <div className={styles.icons}>
              <div className={styles.hoverButton}>
                <button
                  className={styles.smallButton}
                  id={styles.copy}
                  onClick={copy}
                >
                  <ContentCopyIcon className={styles.smallIcon} />
                </button>
                <div className={styles.copyHidden}>{copyLabel}</div>
              </div>
              <div className={styles.hoverButton}>
                <button
                  className={styles.smallButton}
                  id={styles.explore}
                  onClick={explore}
                >
                  <ArrowOutwardIcon className={styles.smallIcon} />
                </button>
                <div className={styles.exploreHidden}>explore</div>
              </div>
            </div>
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p className={styles.accountModalText}>ETH Balance: {ethBalance}</p>
          </Typography>
          {/* <Button
            sx={{ marginTop: 2, height: 55 }}
            variant="contained"
            size="large"
            fullWidth
          >
            View and Sell NFT/TOKEN <ChevronRightIcon />
          </Button> */}
          {pendingTxs.size != 0 && (
            <div>
              <p>Pending transactions:</p>
              {[...pendingTxs].map((tx) => (
                <p>{tx}</p>
              ))}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
