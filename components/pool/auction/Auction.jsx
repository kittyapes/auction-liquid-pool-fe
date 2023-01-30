import React, { useEffect, useState, useRef } from "react";
import styles from "../auction/style/Auction.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import dynamic from "next/dynamic";
import { useWalletContext } from "../../../context/wallet";
import {
  placeBid,
  getDuration,
  getBids,
  isLinear,
} from "../contract/poolContract";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

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
  const { account } = useWalletContext();
  const [auctionDone, setAuctionDone] = useState(false);
  const [noAuction, setNoAuction] = useState(false);
  let pool = {
    src: src.src,
    address: address,
    name: "Azuki",
  };
  const router = useRouter();
  const item = router.query;

  const placeAuction = () => {
    (0.05, item.id, account)
      .on("transactionHash", () => {
        console.log("e");
      })
      .on("receipt", () => {
        setAuctionDone(true);
      })
      .on("error", () => {
        setAuctionDone(true);
      });
  };

  let bidInfo = {};
  let bidAmount = 10;
  const getAuctions = async () => {
    let result = await getBids(item.id);
    bidAmount = result.bidAmount;
    console.log(bidAmount);
    bidInfo = result;
    if (result.winner === "0x0000000000000000000000000000000000000000") {
      setNoAuction(true);
    } else {
      setNoAuction(false);
    }
  };
  const getDuration = () => {
    return getDuration();
  };

  useEffect(() => {
    getAuctions();
  });

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
              src={pool.src}
              alt="pool-logo"
              style={{ width: 300, height: 350, borderRadius: 10 }}
            />
            {noAuction && (
              <div className={styles.details}>
                <div>
                  <div>
                    <p className={styles.subtitle}>No Bids</p>
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
            {!noAuction && !auctionDone && (
              <div className={styles.details}>
                <div>
                  <div>
                    <p className={styles.subtitle}>Current Highest Bid:</p>
                  </div>
                  <div>
                    <p>{bidAmount}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <p className={styles.subtitle}>Current Highest Bid:</p>
                  </div>
                  <div>
                    <p>0.9 wnABC 0.05 ETH</p>
                  </div>
                </div>
                <div>
                  <p className={styles.subtitle}>Next Bid:</p>
                  <input placeholder="1.1 wnABC" />{" "}
                  <input value="0.08 ETH" disabled />
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
            {!noAuction && auctionDone && (
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
