import React, { useState } from "react";
import styles from "../random_swap/style/RandomSwap.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { getTransactionStatus } from "../contract/poolContract";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Button } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { randomSwap } from "../contract/poolContract";
import { useWalletContext } from "../../../context/wallet";
import CircularProgress from "@mui/material/CircularProgress";
const RandomSwap = ({ nftPoolAddress, tokenId }) => {
  const { account, pendingTxs, setPendingTxs } = useWalletContext();
  const [swapDone, setSwapDone] = useState(false);
  const [loading, setLoading] = useState(null);

  // TODO(peter): make sure this function work properly.
  const placeSwap = async () => {
    if (!tokenId || !nftPoolAddress) return;
    const transaction = await randomSwap(tokenId, account, nftPoolAddress);
    setLoading(true);
    // Append current tx into pending tx list.
    setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
    getTransactionStatus(transaction.hash, async () => {
      pendingTxs.delete(transaction.hash);
      setPendingTxs(new Set([...pendingTxs]));
      setLoading(false);
      // TODO(Peter): How to get the new NFT that user get from swap.
    });
  };

  const checkUserNFTs = () => {
    // todo
  };

  return (
    <Grid container className={styles.container}>
      <div>
        <p className={styles.title}>Random Swap:</p>
        {swapDone && (
          <div className={styles.swapDone}>
            <p className={styles.congratesText}>YOU WIN THE ACTION</p>
            <p className={styles.title}>NFT ACB 2123 is yours！</p>
          </div>
        )}
        <Grid container className={styles.upper_detail}>
          <Grid container className={styles.swapBox}>
            <div className={styles.swapPartLeft}>
              <img
                src={src.src}
                alt="pool-logo"
                style={{ width: 300, height: 350, borderRadius: 10 }}
              />
              <p>Azuki #2134</p>
            </div>
            <ArrowRightAltIcon className={styles.swapIcon} />
            <div className={styles.swapPartRight}>
              {swapDone ? (
                <img
                  src={src.src}
                  alt="pool-logo"
                  style={{ width: 300, height: 350, borderRadius: 10 }}
                />
              ) : (
                <QuestionMarkIcon
                  style={{ width: 300, height: 350, borderRadius: 10 }}
                />
              )}
            </div>
          </Grid>
          <Button
            className={styles.swapButton}
            sx={{ marginTop: 2, height: 60 }}
            variant="contained"
            size="large"
            onClick={swapDone ? checkUserNFTs : placeSwap}
          >
            {loading === null ? (
              "PLACE THE RANDOM SWAP"
            ) : loading === true ? (
              <>
                <CircularProgress sx={{ p: 1, color: "white" }} size={40} />{" "}
                <span>Swaping now...</span>
              </>
            ) : (
              "Check your nfts"
            )}
          </Button>
        </Grid>
      </div>
    </Grid>
  );
};

export default RandomSwap;
