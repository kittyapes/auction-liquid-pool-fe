import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../style/Collection.module.css";
import { Button, Box, Divider } from "@mui/material";
import { fetchNFTAuctionInfoFromTokenId } from "../../../../contract/poolContract";
import { Status, getDeadTime, startTimer } from "../../../../auction/utils";
const Card = ({ nft, type, pool }) => {
  // Three type: not activated, activated, sold.
  const router = useRouter();
  const [timer, setTimer] = useState("00:00:00");
  const Ref = useRef(null);
  const [auctionInfo, setAuctionInfo] = useState({});
  const [status, setStatus] = useState(Status.NOT_ACTIVATED);
  const [buttonLabel, setButtonLabel] = useState(null);
  const auction = () => {
    router.push(`/${type.toLowerCase()}/${pool.address}?id=${nft.tokenId}`);
  };

  const clearTimer = (e) => {
    setTimer("00:00:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      let time = startTimer(e);
      setTimer(time);
    }, 1000);
    Ref.current = id;
  };

  useEffect(() => {
    async function fetchNftInfo() {
      const auctionInfo = await fetchNFTAuctionInfoFromTokenId(
        pool.address,
        nft.tokenId
      );
      const bidAmount = Number(auctionInfo.bidAmount);
      const isLinear = pool.isLinear;
      let nextBid;
      if (isLinear) {
        nextBid = bidAmount + Number(pool.delta);
      } else {
        nextBid = bidAmount * (Number(ratio) + 1);
      }
      auctionInfo["nextBidAmount"] = nextBid;
      setAuctionInfo(auctionInfo);
      if (auctionInfo.winner != "0x0000000000000000000000000000000000000000") {
        setStatus(Status.SOLD);
        setButtonLabel("Sold");
      } else if (auctionInfo.startedAt != 0) {
        setStatus(Status.ACTIVATED);
        setButtonLabel(`Place Next Bid: ${auctionInfo.nextBidAmount}`);
        let timestamp = Number(auctionInfo.startedAt) + Number(pool.duration);
        clearTimer(getDeadTime(timestamp));
      } else {
        setStatus(Status.NOT_ACTIVATED);
        setButtonLabel("Start Auction");
      }
    }
    fetchNftInfo();
  }, []);

  return (
    <div className={styles.card}>
      <div>
        {status == Status.ACTIVATED && (
          <p className={styles.timer} style={{ margin: "0" }}>
            {timer}
          </p>
        )}
        <img className={styles.nft_image} src={nft.src} />
      </div>
      <Button
        sx={{ marginTop: 2, height: 60 }}
        size="large"
        variant="contained"
        disabled={status == Status.SOLD}
        className={`${styles.button} ${styles.purple}`}
        onClick={auction}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default Card;
