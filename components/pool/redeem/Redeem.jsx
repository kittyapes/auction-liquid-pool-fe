import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { ArrowRightAlt } from "@mui/icons-material";
import { useWeb3Context } from "../../../utils/web3-context";
import { getAllowance } from "../../../utils/contracts/token-slice";
import {
  redeemNFT,
  getTxStatus,
  usePool,
} from "../../../utils/contracts/pool-slice";
import src from "../../../static/images/src.jpeg";
import styles from "../redeem/style/Redeem.module.css";

const Redeem = ({ nftPoolAddress }) => {
  if (!nftPoolAddress) return;

  const { account, provider, pendingTxs, setPendingTxs } = useWeb3Context();
  const [redeemNumber, setRedeemNumber] = useState(0);
  const [loading, setLoading] = useState(null);

  const { data: pool } = usePool(nftPoolAddress);

  const placeRedemption = async () => {
    if (redeemNumber == 0 || pool.mappingToken == null) return;

    const res = await getAllowance(pool.mappingToken, account, nftPoolAddress);
    if (res.isZero()) {
      console.log("Error, failed to get allowance.");
      return;
    }

    const transaction = await redeemNFT(provider, nftPoolAddress, redeemNumber);
    setLoading(true);
    // Append current tx into pending tx list.
    setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
    getTxStatus(transaction.hash, async () => {
      pendingTxs.delete(transaction.hash);
      setPendingTxs(new Set([...pendingTxs]));
      setLoading(false);
      // TODO(Peter): How to get the new NFT that user get from redeem.
    });
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
            <ArrowRightAlt className={styles.swapIcon} />
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
            {loading === null ? (
              " PLACE THE REDEMPTION"
            ) : loading === true ? (
              <>
                <CircularProgress sx={{ p: 1, color: "white" }} size={40} />{" "}
                <span>Redeeming now...</span>
              </>
            ) : (
              "Check your nfts"
            )}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default Redeem;
