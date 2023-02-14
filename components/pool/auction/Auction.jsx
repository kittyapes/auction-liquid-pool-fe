import React, { useEffect, useState, useRef } from "react";
import styles from "../auction/style/Auction.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import dynamic from "next/dynamic";
import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import {
  placeBid,
  fetchNFTAuctionInfoFromTokenId,
  getDuration,
  getBids,
  getDelta,
  getIsLinear,
} from "../contract/poolContract";
import { fetchPoolInfo } from "../contract/poolContract";
import { Status, TxStatus, getDeadTime, startTimer } from "./utils";
import { ethers } from "ethers";
import { useWalletContext } from "../../../context/wallet";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3);",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3);",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3);",
      },
      "&.Mui-disabled fieldset": {
        backgroundColor: "rgba(255, 255, 255, 1);",
        borderWidth: "2px",
      },
    },
  },
})(TextField);

// TODO(peter): This chart is just a placehoder, it should indicate the price change of
// each bid. Need to connect the subgraph and then get the data.
const chart = {
  series: [
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "",
      align: "left",
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "1/1",
        "1/2",
        "1/3",
        "1/4",
        "1/5",
        "1/6",
        "1/7",
        "1/8",
        "1/9",
      ],
    },
  },
};

const Auction = ({ address }) => {
  const [status, setStatus] = useState(null);
  const [auctionInfo, setAuctionInfo] = useState({});
  const [timer, setTimer] = useState("00:00:00");
  const { account, pendingTxs } = useWalletContext();
  const [tx, setTx] = useState(null);
  const Ref = useRef(null);
  const router = useRouter();
  const item = router.query;
  const tokenId = item.id;

  const [txStatus, setTxStatus] = useState(TxStatus.NONE);

  useEffect(() => {
    async function fetchNftInfo() {
      if (!tokenId || txStatus == TxStatus.PENDING) return;
      const auctionInfo = await fetchNFTAuctionInfoFromTokenId(
        address,
        Number(tokenId)
      );
      const poolInfo = await fetchPoolInfo(address);
      const bidAmount = Number(auctionInfo.bidAmount);
      const isLinear = poolInfo.isLinear;
      let nextBid;
      if (isLinear) {
        nextBid = bidAmount + Number(poolInfo.delta);
      } else {
        nextBid = bidAmount * (Number(poolInfo.ratio) + 1);
      }
      auctionInfo.nextBidAmount = nextBid;
      setAuctionInfo(auctionInfo);
      if (auctionInfo.winner != "0x0000000000000000000000000000000000000000") {
        setStatus(Status.SOLD);
      } else if (auctionInfo.startedAt != 0) {
        setStatus(Status.ACTIVATED);
      } else {
        setStatus(Status.NOT_ACTIVATED);
      }
      if (status == Status.ACTIVATED) {
        let timestamp =
          Number(auctionInfo.startedAt) + Number(poolInfo.duration);
        clearTimer(getDeadTime(timestamp));
      }
    }
    fetchNftInfo();
  }, [txStatus]);

  // TODO(peter): make sure this function work properly.
  const placeAuction = async () => {
    const transaction = await placeBid(0.05, item.id, account);
    setTx(transaction.hash);
    setTxStatus(TxStatus.PENDING);
    setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
  };

  useEffect(() => {
    if (tx != null && !pendingTxs.has(tx)) {
      setTxStatus(TxStatus.DONE);
    }
  }, [pendingTxs]);

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("00:00:00");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      let time = startTimer(e);
      setTimer(time);
    }, 1000);
    Ref.current = id;
  };

  return (
    <Grid container className={styles.container}>
      <div>
        <p className={styles.title}>NFT Auction Liquidity Pool:</p>
        <input className={styles.addressBar} disabled value={address} />
      </div>
      <div>
        <p className={`${styles.title} ${styles.compress}`}>
          ETH Price Per DGRP
        </p>
        <p className={styles.subtitle}>
          Displays how your sell price gose up with each DGRP sold.
        </p>
        <div id="chart">
          <ApexCharts
            options={chart.options}
            series={chart.series}
            type="area"
            height={350}
          />
        </div>
      </div>
      <div>
        <p className={styles.title}>Tokens In the Pool:</p>
        <Grid container className={styles.upper_detail}>
          <Grid container className={styles.detail_intro}>
            <img
              src={src.src}
              alt="pool-logo"
              style={{ width: 300, height: 350, borderRadius: 10 }}
            />
            {status == Status.NOT_ACTIVATED && (
              <div className={styles.details}>
                <div>
                  <div>
                    <p className={styles.subtitle} style={{ marginTop: "0" }}>
                      New auction start price:
                    </p>
                  </div>
                  <div>
                    <span
                      className={`${styles.mappingToken} ${styles.space}`}
                    >{`1 MT`}</span>
                    <span className={styles.currencyToken}>
                      {ethers.utils.formatUnits(auctionInfo.bidAmount)}
                      DEX
                    </span>
                  </div>
                </div>
                <Button
                  sx={{ marginTop: 2, height: 60 }}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={placeAuction}
                >
                  Start auction
                </Button>
              </div>
            )}
            {status == Status.ACTIVATED && (
              <div className={styles.details}>
                <div>
                  <div>
                    <p className={styles.subtitle} style={{ marginTop: "0" }}>
                      Auction Ends In:
                    </p>
                  </div>
                  <div className={styles.timer}>
                    <p style={{ margin: "0" }}>{timer}</p>
                  </div>
                  <div>
                    <p className={styles.subtitle}>Current Highest Bid:</p>
                  </div>
                  <div>
                    <span
                      className={`${styles.mappingToken} ${styles.space}`}
                    >{`1 MT`}</span>
                    <span className={styles.currencyToken}>
                      {ethers.utils.formatUnits(auctionInfo.bidAmount)}
                      DEX
                    </span>
                  </div>
                </div>
                <div>
                  <div>
                    <p className={styles.subtitle}>Next Minimum Bid</p>
                  </div>
                  <div>
                    <span
                      className={`${styles.mappingToken} ${styles.space}`}
                    >{`1 MT`}</span>
                    <span className={styles.currencyToken}>
                      {ethers.utils.formatUnits(auctionInfo.nextBidAmount)}
                      DEX
                    </span>
                  </div>
                </div>
                <div>
                  <p className={styles.subtitle}>Next Bid:</p>
                  <div className={styles.nextBidBox}>
                    <span className={`${styles.mappingToken} ${styles.space}`}>
                      1 MT
                    </span>
                    <CssTextField
                      sx={{
                        marginTop: 2,
                        display: "flex",
                        fontSize: "1rem",
                        fontWeight: "700",
                        input: { color: "white" },
                        width: "60%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      placeholder={ethers.utils.formatEther(
                        auctionInfo.nextBidAmount
                      )}
                      type="number"
                    />
                    <span className={styles.currencyToken}>DEX</span>
                  </div>
                </div>
                <Button
                  sx={{ marginTop: 2, height: 60 }}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={placeAuction}
                >
                  PLACE THE NEXT BID
                </Button>
              </div>
            )}
            {status == Status.SOLD && (
              <div className={styles.auctionDone}>
                <div>
                  <p>YOU WIN THE ACTION</p>
                  <p>NFT ACB 2123 is yours！</p>
                </div>
                <div>
                  <p>cost</p>
                  <p>0.9 wnABC</p>
                  <p>0.05 ETH</p>
                  <Button
                    sx={{ marginTop: 2, height: 60 }}
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={placeAuction}
                  >
                    Check Your NFTs
                  </Button>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default Auction;
