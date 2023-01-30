import React, { useEffect, useState, useRef } from "react";
import styles from "../auction/style/Auction.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import congrats from "../../../static/animation/congrats.json";
import { placeBid, getDuration, getBids, getDelta, getIsLinear} from "../contract/poolContract"
import { ethers } from "ethers";
import { useWalletContext } from "../../../context/wallet";
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
    const Ref = useRef(null);
    const [auctionDone, setAuctionDone] = useState(false);
    const [bidInfo, setBidInfo] = useState({
        noAuction:true,
        bidAmount: 0,
        winner: "0x0000000000000000000000000000000000000000",
        startedAt: 0,
        nextMinimumBidAmount:0
    })
    let pool = {
        src: src.src,
        address: address,
        name: "Azuki",
    };
    const router = useRouter()
    const item = router.query;
    
    const placeAuction = () => {
        placeBid(0.05, item.id, account).on("transactionHash", () => {
            console.log("e")
        })
        .on("receipt", () => {
            setAuctionDone(true)
        })
        .on("error", () => {
            setAuctionDone(true)
        });
       
    }

    const getAuctionsInfo = async() => {
        let result = await getBids(item.id)
        let isLinear = await getIsLinear()
        let delta = await getDelta()
        let duration = await getDuration()
        setBidInfo({
            noAuction: result.winner === "0x0000000000000000000000000000000000000000",
            bidAmount: result.bidAmount,
            winner: result.winner,
            startedAt: result.startedAt,
            nextMinimumBidAmount: Number(result.bidAmount) + Number(delta),
            duration:duration
        }) 
        let timestamp = Number(result.startedAt) + Number(duration)
        clearTimer(getDeadTime(timestamp));
    }


    useEffect(() => {
        getAuctionsInfo()
    },[]);


    const [timer, setTimer] = useState('00:00:00');
  
  
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }
  
  
    const startTimer = (e) => {
        let { total, hours, minutes, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
  
            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }
    const getDeadTime = (timestamp) => {
        console.log(timestamp)
        let deadline = new Date(timestamp * 1000);
        console.log(deadline)
        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline;
    }
    const clearTimer = (e) => {
  
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next    
        setTimer('00:00:00');
  
        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }

  return (
    <Grid container className={styles.container}>
        <div>
            <p className={styles.title}>NFT Auction Liquidity Pool:</p>
            <input className={styles.addressBar} disabled value={address} />
        </div>
        <div>
            <p className={`${styles.title} ${styles.compress}`}>ETH Price Per DGRP</p>
            <p className={styles.subtitle}>Displays how your sell price gose up with each DGRP sold.</p>
            <div id="chart">
                <ApexCharts options={chart.options} series={chart.series} type="area" height={350} />
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
                    {bidInfo.noAuction && <div className={styles.details}>
                        <div>
                            <div>
                                <p className={styles.subtitle}>No Bids</p>
                            </div>
                        </div>
                        <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth onClick={placeAuction}>PLACE THE NEXT BID</Button>
                    </div>
                    }
                    {!bidInfo.noAuction && !auctionDone && <div className={styles.details}>
                        <div>
                            <div>
                                <p className={styles.subtitle}>Auction Ends In:</p>
                            </div>
                            <div>
                                <p>
                                {timer}
                                </p>
                            </div>
                            <div>
                                <p className={styles.subtitle}>Current Highest Bid:</p>
                            </div>
                            <div>
                                <p>{ethers.utils.formatEther(bidInfo.bidAmount)}
                                ETH
                                </p>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className={styles.subtitle}>Next Minimum Bid</p>
                            </div>
                            <div>
                                <p>{ethers.utils.formatEther(bidInfo.nextMinimumBidAmount)} ETH</p>
                            </div>
                        </div>
                        <div>
                            <p className={styles.subtitle}>Next Bid:</p>
                            <input placeholder={ethers.utils.formatEther(bidInfo.nextMinimumBidAmount)}/> ETH
                        </div>
                        <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth onClick={placeAuction}>PLACE THE NEXT BID</Button>
                    </div>}
                    {!bidInfo.noAuction && auctionDone && <div className={styles.auctionDone}>
                        <div>
                            <p>YOU WIN THE ACTION</p>
                            <p>NFT ACB 2123 is yours！</p>
                        </div>
                        <div>
                            <p>cost</p>
                            <p>0.9 wnABC</p>
                            <p>0.05 ETH</p>
                            <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth onClick={placeAuction}>Check Your NFTs</Button>
                        </div>
                    </div>}
                </Grid>

            </Grid>
        </div>
    </Grid>
);
};

export default Auction;
