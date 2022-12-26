import React, { useEffect, useState, useRef } from "react";
import styles from "../redeem/style/Redeem.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Button } from '@mui/material';
import dynamic from 'next/dynamic';

const Redeem = ({ address }) => {
    const [redeemDone, setRedeemDone] = useState(false);
    const router = useRouter();
    let pool = {
        src: src.src,
        address: address,
        name: "Azuki",
    };
    const placeRedemption = () => {
        setRedeemDone(true);
    }
    const checkUserNFTs = () => {
        // todo
    }
    return (
        <Grid container className={styles.container}>
            <div>
                <p className={styles.title}>Random Redemption:</p>
                <Grid container className={styles.upper_detail}>
                    {!redeemDone && <div>
                        <Grid container className={styles.swapBox}>
                            <div className={styles.swapPartLeft}>
                                <img
                                    src={pool.src}
                                    alt="pool-logo"
                                    style={{ width: 300, height: 350, borderRadius: 10 }}
                                />
                                <div className={styles.textBox}>
                                    <p className={styles.subtitle}>You will pay: </p>
                                    <input className={styles.swapInput} type='number' />
                                    <p className={styles.subtitle}>$AZUKI</p>
                                </div>
                            </div>
                            <ArrowRightAltIcon className={styles.swapIcon} />
                            <div className={styles.swapPartRight}>
                                <img
                                    src={pool.src}
                                    alt="pool-logo"
                                    style={{ width: 300, height: 350, borderRadius: 10 }}
                                />
                                <div className={styles.textBox}>
                                    <p className={styles.subtitle}>You will pay: </p>
                                    <input className={styles.swapInput} type='number' />
                                    <p className={styles.subtitle}>AZUKI NFT</p>
                                </div>
                            </div>
                        </Grid>
                        <Button className={styles.redeemButton} sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" onClick={placeRedemption}>PLACE THE REDEMPTION</Button>
                    </div>}
                    {redeemDone && <div className={styles.redeemDone}>
                        <img
                            src={pool.src}
                            alt="pool-logo"
                            style={{ width: 300, height: 350, borderRadius: 10 }}
                        />
                        <div className={styles.redeemDetails}>
                            <div>
                                <p>YOU WIN THE ACTION</p>
                                <p>NFT ACB 2123 is yours！</p>
                            </div>
                            <div>
                                <p>cost</p>
                                <p>0.9 wnABC</p>
                                <p>0.05 ETH</p>
                                <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth onClick={checkUserNFTs}>Check Your NFTs</Button>
                            </div>
                        </div>
                    </div>}
                </Grid>
            </div>
        </Grid>
    );
};

export default Redeem;

