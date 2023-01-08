import React, { useEffect, useState, useRef } from "react";
import styles from "../random_swap/style/RandomSwap.module.css";
import src from "../../../static/images/src.jpeg";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Button } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import dynamic from 'next/dynamic';
import {randomSwap} from '../contract/poolContract'
import { useWeb3React } from "@web3-react/core";
const RandomSwap = ({ address, tokenId }) => {
    const { account } = useWeb3React();
    const [swapDone, setSwapDone] = useState(false);
    const router = useRouter();
    let pool = {
        src: src.src,
        address: address,
        name: "Azuki",
    };
    const item = router.query;
    const placeSwap = async () => {
        randomSwap(item.id,account)
        // setSwapDone(true);
    }
    const checkUserNFTs = () => {
        // todo
    }
    return (
        <Grid container className={styles.container}>
            <div>
                <p className={styles.title}>Random Swap:</p>
                {swapDone && <div className={styles.swapDone}>
                    <p className={styles.congratesText}>YOU WIN THE ACTION</p>
                    <p className={styles.title}>NFT ACB 2123 is yours！</p>
                </div>}
                <Grid container className={styles.upper_detail}>
                    <Grid container className={styles.swapBox}>
                        <div className={styles.swapPartLeft}>
                            <img
                                src={pool.src}
                                alt="pool-logo"
                                style={{ width: 300, height: 350, borderRadius: 10 }}
                            />
                            <p>Azuki #2134</p>
                        </div>
                        <ArrowRightAltIcon className={styles.swapIcon} />
                        <div className={styles.swapPartRight}>
                            {swapDone ? <img
                                src={pool.src}
                                alt="pool-logo"
                                style={{ width: 300, height: 350, borderRadius: 10 }}
                            /> :
                                <QuestionMarkIcon style={{ width: 300, height: 350, borderRadius: 10 }} />}
                        </div>
                    </Grid>
                    <Button
                        className={styles.swapButton}
                        sx={{ marginTop: 2, height: 60 }}
                        variant="contained"
                        size="large"
                        onClick={swapDone ? checkUserNFTs : placeSwap}>
                        {swapDone ? 'check User NFTs' : 'PLACE THE RANDOM SWAP'}</Button>
                </Grid>
            </div>
        </Grid>
    );
};

export default RandomSwap;

