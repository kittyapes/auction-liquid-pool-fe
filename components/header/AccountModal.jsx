import React, { useEffect, useState } from "react";
import { Box, Typography, Modal } from "@mui/material";
import { ContentCopy, ArrowOutward } from "@mui/icons-material";
import { utils } from "ethers";
import { useWeb3Context } from "../../utils/web3-context";
import Identicon from "./IdentIcon";
import styles from "../header/style/Header.module.css";

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

export default function AccountModal({ open, onClose }) {
  const { account, provider, pendingTxs } = useWeb3Context();
  const [ethBalance, setETHBalance] = useState(0);
  const [copyLabel, setCopyLabel] = useState("copy");

  useEffect(() => {
    const fetchETHBalance = async () => {
      const balance = await provider.getBalance(account);
      setETHBalance(formatFloatNumber(utils.formatEther(balance)));
    };

    if (provider) fetchETHBalance();
  }, [account, provider]);

  const formatFloatNumber = (x) => Number.parseFloat(x).toFixed(3);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopyLabel("copied!");
  };

  const handleExplore = () =>
    window.open(`https://goerli.etherscan.io/address/${account}`, "_blank");

  return (
    <div>
      <Modal open={open} onClose={onClose}>
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
                  onClick={handleCopy}
                >
                  <ContentCopy className={styles.smallIcon} />
                </button>
                <div className={styles.copyHidden}>{copyLabel}</div>
              </div>
              <div className={styles.hoverButton}>
                <button
                  className={styles.smallButton}
                  id={styles.explore}
                  onClick={handleExplore}
                >
                  <ArrowOutward className={styles.smallIcon} />
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
