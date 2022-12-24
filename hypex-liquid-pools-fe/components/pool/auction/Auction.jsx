import React, { useEffect, useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import styles from "../auction/style/Auction.module.css";
import Azuki from "../../../static/images/azuki.jpeg";
import eth from "../../../static/images/eth.png";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider";

const Auction = ({ address }) => {
    const router = useRouter();
    const useToHome = () => {
        router.push("/");
    };
    let pool = {
        src: Azuki.src,
        address: address,
        name: "Azuki",
    };

    return (
        <Grid container className={styles.container}>
            <div>
                <p className={styles.title}>NFT Auction Liquidity Pool:</p>
                <input value={address} />
            </div>
            <div>
                <p className={styles.title}>ETH Price Per DGRP</p>
                <p className={styles.subtitle}>Displays how your sell price gose up with each DGRP sold.</p>
                <p>placeholder</p>
            </div>
            <div>
                <p className={styles.title}>Tokens In the Pool:</p>
                <Grid container className={styles.upper_detail}>
                    <Grid container className={styles.detail_intro}>
                        <Grid xs={2} item={true}>
                            <Avatar
                                src={pool.src}
                                alt="pool-logo"
                                sx={{ width: 150, height: 150 }}
                            />
                        </Grid>
                        <Grid xs={10} className={styles.details} item={true}>
                            <div>
                                <div>
                                    <p className={styles.text}>Current Highest Bid:</p>
                                </div>
                                <div>
                                    <p>23:59:40 LEFT</p>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p className={styles.text}>Current Highest Bid:</p>
                                </div>
                                <div>
                                    <p>{pool.address}</p>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p className={styles.text}>Next Bid:</p>
                                </div>
                                <div>
                                    <p>{pool.address}</p>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        </Grid>
    );
};

export default Auction;

