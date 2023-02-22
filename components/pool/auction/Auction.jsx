import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { withStyles } from "@mui/styles";
import dynamic from "next/dynamic";
import { BigNumber, utils } from "ethers";
import { useWeb3Context } from "../../../utils/web3-context";
import {
  placeBid,
  getTxStatus,
  useAuction,
  usePool,
} from "../../../utils/contracts/pool-slice";
import {
  Status,
  TxStatus,
  getDeadTime,
  startTimer,
} from "../../../utils/helper";
import src from "../../../static/images/src.jpeg";
import styles from "../auction/style/Auction.module.css";
import {
  getAllowance,
  increaseAllowance,
} from "../../../utils/contracts/token-slice";
import { DEX_TOKEN_ADDRESS } from "../../../utils/constants";

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

const chart = {
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

const Auction = ({ nftPoolAddress, tokenId }) => {
  if (!nftPoolAddress || !tokenId) return;
  const Ref = useRef(null);
  const { account, provider, pendingTxs } = useWeb3Context();
  const [status, setStatus] = useState(null);
  const [timer, setTimer] = useState("00:00:00");
  const [txStatus, setTxStatus] = useState(TxStatus.NONE);

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
    // TODO(Peter): verify whether auction status should be
    // set to not activated if aution is null.
    if (auction == null) {
      setStatus(Status.NOT_ACTIVATED);
    } else {
      let deadTime = getDeadTime(auction.expireAt);
      if (deadTime < Date.now()) {
        setStatus(Status.END);
      } else {
        setStatus(Status.ACTIVATED);
        clearTimer(deadTime);
      }
    }
  }, [auction]);

  const startAuction = async () => {
    if (!pool) return;

    const mAllowance = await getAllowance(
      pool.mappingToken,
      account,
      nftPoolAddress
    );
    if (mAllowance.lt(BigNumber.from(pool.ratio)))
      await increaseAllowance(
        provider,
        pool.mappingToken,
        nftPoolAddress,
        BigNumber.from(pool.ratio).sub(mAllowance)
      );
    const dAllowance = await getAllowance(
      DEX_TOKEN_ADDRESS,
      account,
      nftPoolAddress
    );
    if (dAllowance.lt(BigNumber.from(nextBidAmount)))
      await increaseAllowance(
        provider,
        DEX_TOKEN_ADDRESS,
        nftPoolAddress,
        nextBidAmount.sub(dAllowance)
      );

    const transaction = await placeBid(provider, nftPoolAddress, tokenId);
    setTx(transaction.hash);
    setTxStatus(TxStatus.PENDING);
    setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
    getTxStatus(transaction.hash, async () => {
      pendingTxs.delete(transaction.hash);
      setPendingTxs(new Set([...pendingTxs]));
      setTxStatus(TxStatus.DONE);
    });
  };

  const clearTimer = (e) => {
    setTimer("");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      let time = startTimer(e);
      setTimer(time);
    }, 1000);
    Ref.current = id;
  };

  const series = [
    {
      name: "Desktops",
      data: (auction ? auction.bids : []).map(
        (x) => +utils.formatEther(x.amount)
      ),
    },
  ];

  return (
    <Grid container className={styles.container}>
      <div>
        <p className={styles.title}>NFT Auction Liquidity Pool:</p>
        <input className={styles.addressBar} disabled value={nftPoolAddress} />
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
            series={series}
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
                      {utils.formatEther(0)}
                      DEX
                    </span>
                  </div>
                </div>
                <Button
                  sx={{ marginTop: 2, height: 60 }}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={startAuction}
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
                    {account == auction.highestBid.account && (
                      <p> Your are the highest bid!</p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`${styles.mappingToken} ${styles.space}`}
                    >{`1 MT`}</span>
                    <span className={styles.currencyToken}>
                      {utils.formatEther(auction.highestBid.amount)}
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
                      {utils.formatEther(nextBidAmount)}
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
                      placeholder={utils.formatEther(nextBidAmount)}
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
                  onClick={startAuction}
                >
                  PLACE THE NEXT BID
                </Button>
              </div>
            )}
            {status == Status.END && (
              <div className={styles.auctionDone}>
                {account == auction.highestBid.account ? (
                  <div>
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
                        onClick={startAuction}
                      >
                        Check Your NFTs
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className={styles.subtitle} style={{ marginTop: "0" }}>
                      Auction winner is:
                    </p>
                    <p style={{ margin: "0" }}>{auction.highestBid.account}</p>
                  </div>
                )}
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default Auction;
