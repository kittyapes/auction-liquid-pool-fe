import React, { useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { ArrowRightAlt, QuestionMark } from "@mui/icons-material";
import { useWeb3Context } from "../../../utils/web3-context";
import {
  getTxStatus,
  swapNFT,
  useSwaps,
} from "../../../utils/contracts/pool-slice";
import src from "../../../static/images/src.jpeg";
import styles from "../random_swap/style/RandomSwap.module.css";

const RandomSwap = ({ nftPoolAddress, tokenId }) => {
  const { account, provider, pendingTxs, setPendingTxs } = useWeb3Context();
  const [swapDone, setSwapDone] = useState(false);
  const [loading, setLoading] = useState(null);

  const { data: swaps } = useSwaps(nftPoolAddress, account);

  const placeSwap = async () => {
    if (!tokenId || !nftPoolAddress) return;
    const transaction = await swapNFT(provider, nftPoolAddress, tokenId);
    setLoading(true);
    // Append current tx into pending tx list.
    setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
    getTxStatus(transaction.hash, async () => {
      pendingTxs.delete(transaction.hash);
      setPendingTxs(new Set([...pendingTxs]));
      setLoading(false);
      // TODO(Peter): How to get the new NFT that user get from swap.
    });
  };

  const swap = useMemo(
    () => swaps.filter((x) => x.outTokenId == tokenId),
    [swaps, tokenId]
  );

  const checkUserNFTs = () => {
    // todo
  };

  return (
    <Grid container className={styles.container}>
      <div>
        <p className={styles.title}>Random Swap:</p>
        {swapDone && (
          <div className={styles.swapDone}>
            <p className={styles.congratsText}>YOU WIN THE ACTION</p>
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
            <ArrowRightAlt className={styles.swapIcon} />
            <div className={styles.swapPartRight}>
              {swapDone ? (
                <img
                  src={src.src}
                  alt="pool-logo"
                  style={{ width: 300, height: 350, borderRadius: 10 }}
                />
              ) : (
                <QuestionMark
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
                <span>Swapping now...</span>
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
