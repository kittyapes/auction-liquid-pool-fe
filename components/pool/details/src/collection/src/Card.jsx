import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { BigNumber, utils } from "ethers";
import {
  useAuction,
  usePool,
} from "../../../../../../utils/contracts/pool-slice";
import {
  Status,
  getDeadTime,
  startTimer,
} from "../../../../../../utils/helper";
import styles from "../style/Collection.module.css";

const Card = ({ nftPoolAddress, type, src, tokenId }) => {
  // Three type: not activated, activated, sold.
  const router = useRouter();
  const Ref = useRef(null);
  const [timer, setTimer] = useState("00:00:00");
  const [status, setStatus] = useState(Status.NOT_ACTIVATED);
  const [buttonLabel, setButtonLabel] = useState(null);

  const { data: pool } = usePool(nftPoolAddress);
  const { data: auction } = useAuction(nftPoolAddress, tokenId);

  const nextBidAmount = useMemo(() => {
    if (!auction) return BigNumber.from(0);
    const bidAmount = BigNumber.from(auction.highestBid.amount.toString());
    return pool.isLinear
      ? bidAmount.add(BigNumber.from(pool.delta))
      : bidAmount.mul(pool.delta + 1000).div(1000);
  }, [auction]);

  useEffect(() => {
    if (type == "Auction") {
      if (!auction || auction.isEnded) {
        setStatus(Status.NOT_ACTIVATED);
        setButtonLabel("Start Auction");
      } else {
        let deadTime = getDeadTime(auction.expireAt);
        if (deadTime < Date.now()) {
          setStatus(Status.END);
          setButtonLabel("Auction Ended");
        } else {
          setStatus(Status.ACTIVATED);
          clearTimer(deadTime);
          setButtonLabel(`Place Next Bid: ${utils.formatEther(nextBidAmount)}`);
        }
      }
    } else {
      setButtonLabel("Swap");
    }
  }, [auction]);

  const handleAuction = () =>
    router.push(`/${type.toLowerCase()}/${nftPoolAddress}?id=${tokenId}`);

  const clearTimer = (e) => {
    setTimer("00:00:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      let time = startTimer(e);
      setTimer(time);
    }, 1000);
    Ref.current = id;
  };

  return (
    <div className={styles.card}>
      <div>
        {status == Status.ACTIVATED && (
          <p className={styles.timer} style={{ margin: "0" }}>
            {timer}
          </p>
        )}
        <img className={styles.nft_image} src={src} />
      </div>
      <Button
        sx={{ marginTop: 2, height: 60 }}
        size="large"
        variant="contained"
        disabled={status == Status.END}
        className={`${styles.button} ${styles.purple}`}
        onClick={handleAuction}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default Card;
