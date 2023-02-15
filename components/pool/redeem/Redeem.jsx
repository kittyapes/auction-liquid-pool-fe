import React, { useEffect, useState, useRef } from "react";
import styles from "../redeem/style/Redeem.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Button } from "@mui/material";
import dynamic from "next/dynamic";
import { redeemNFT, getTransactionStatus } from "../contract/poolContract";
import { useWalletContext } from "../../../context/wallet";
import {
  getAllowance,
  increaseAllowance,
  mappingTokenInfo,
} from "../contract/mappingTokenContract";
const Redeem = ({ address }) => {
  const { account } = useWalletContext();
  const [redeemNumber, setRedeemNumber] = useState(0);
  const [mappingTokenAddress, setMappingTokenAddress] = useState(null);
  useEffect(() => {
    async function fetchMappingTokenAddress() {
      const mappingTokenAddress = await mappingTokenInfo();
      setMappingTokenAddress(mappingTokenAddress);
    }
    fetchMappingTokenAddress();
  });

  // TODO(peter): make sure this function work properly.
  const placeRedemption = async () => {
    if (redeemNumber == 0 || mappingTokenAddress == null) return;
    await getAllowance(account, address, mappingTokenAddress);
    const c = await redeemNFT(account, redeemNumber);
    // Append current tx into pending tx list.
    setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
    getTransactionStatus(transaction.hash, async () => {
      pendingTxs.delete(transaction.hash);
      setPendingTxs(new Set([...pendingTxs]));
      // TODO(Peter): How to get the new NFT that user get from redeem.
    });
  };

  const checkUserNFTs = () => {
    // todo
  };

  const changeRedeemNumber = (event) => {
    if (event.target.value < 0) return;
    setRedeemNumber(event.target.value);
  };

  return (
    <Grid container className={styles.container}>
      <p className={styles.title}>Random Redemption:</p>
      <Grid container className={styles.upper_detail}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <Grid container className={styles.redeemBox}>
            <div className={styles.swapPartLeft}>
              <img
                src={src.src}
                alt="pool-logo"
                style={{ width: 300, height: 350, borderRadius: 10 }}
              />
              <div className={styles.textBox}>
                <p className={styles.subtitle}>You will pay: </p>
                <input
                  className={styles.swapInput}
                  type="number"
                  value={redeemNumber}
                  onChange={changeRedeemNumber}
                />
                <p className={styles.subtitle}>$AZUKI</p>
              </div>
            </div>
            <ArrowRightAltIcon className={styles.swapIcon} />
            <div className={styles.swapPartRight}>
              <img
                src={src.src}
                alt="pool-logo"
                style={{ width: 300, height: 350, borderRadius: 10 }}
              />
              <div className={styles.textBox}>
                <p className={styles.subtitle}>You will receive: </p>
                <input
                  className={styles.swapInput}
                  type="number"
                  value={redeemNumber}
                  disabled={true}
                />
                <p className={styles.subtitle}>AZUKI NFT</p>
              </div>
            </div>
          </Grid>
          <Button
            className={styles.redeemButton}
            sx={{ marginTop: 2, height: 60 }}
            variant="contained"
            size="large"
            onClick={placeRedemption}
          >
            PLACE THE REDEMPTION
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default Redeem;
