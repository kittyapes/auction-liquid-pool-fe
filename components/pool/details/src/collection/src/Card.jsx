import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../style/Collection.module.css";
import { Button, Box, Divider } from "@mui/material";
import { fetchNFTAuctionInfoFromTokenId } from "../../../../contract/poolContract";
const Status = {
  NOT_ACTIVATED: "NOT_ACTIVIATED",
  ACTIVATED: "ACTIVIATED",
  SOLD: "SOLD",
};

const Card = ({ nft, type, pool }) => {
  // Three type: not activated, activated, sold.
  const router = useRouter();
  const [auctionInfo, setAuctionInfo] = useState(false);
  const [status, setStatus] = useState(Status.NOT_ACTIVATED);
  const [buttonLabel, setButtonLabel] = useState("Auction");
  const auction = () => {
    router.push(`/${type.toLowerCase()}/${pool.address}?id=${nft.tokenId}`);
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
      console.log(auctionInfo);
      if (auctionInfo.winner != "0x0000000000000000000000000000000000000000") {
        setStatus(Status.SOLD);
        setButtonLabel("Sold");
      } else if (auctionInfo.startedAt != 0) {
        setStatus(Status.ACTIVATED);
        setButtonLabel(`Place Next Bid: ${auctionInfo.nextBidAmount}`);
      } else {
        setStatus(Status.NOT_ACTIVATED);
        setButtonLabel("Start New Auction");
      }
    }
    fetchNftInfo();
  }, []);

  return (
    <div className={styles.card}>
      <div>
        <img className={styles.nft_image} src={nft.src} />
      </div>
      <Button
        sx={{ marginTop: 2, height: 60 }}
        variant="contained"
        size="large"
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
