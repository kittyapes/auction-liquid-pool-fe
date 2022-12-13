import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import styles from '../details/style/Details.module.css';
import Azuki from '../../../static/images/azuki.jpeg'
import eth from '../../../static/images/eth.png'
import Grid from '@mui/material/Grid'; 
import Avatar from '@mui/material/Avatar'
import UserActions from './src/user_actions/UserActions';
import { useRouter } from "next/router";
import Divider from '@mui/material/Divider';

const Details = () => {
  const router = useRouter();
  const useToHome = () => {
    router.push('/')
  }
  let pool = {
      src: Azuki.src,
      address:'0x342153215aabdc432143',
      name:'Azuki'
  }

  return (
    <Grid container className={styles.container}>
        <Grid container className={styles.upper_detail}>
            <Grid container className={styles.detail_intro}>
                <Grid xs={2}>
                    <Avatar src={pool.src} alt="pool-logo" sx={{ width: 150, height: 150 }}/>
                </Grid>
                <Grid xs={10} className={styles.details}>
                    <div>
                        <div><p className={styles.text}>NFT Auction Liquidity Pool:</p></div>
                        <div><p>{pool.name}</p></div>
                    </div>
                    <div>
                        <div><p className={styles.text}>NFT Contract Address:</p></div>
                        <div><p>{pool.address}</p></div>
                    </div>
                </Grid>
            </Grid>
            <Divider className={styles.divider} variant="middle" />
            <Grid container>
                {
                    cardDatas.map((data) => {
                        return <Grid xs={2}>
                            <p className={styles.text}>{data.title}</p>
                            <p className={styles.value}>{data.value}</p>
                            <p className={styles.sub_value}>{data.subValue ?? ''}</p>
                        </Grid>
                    })
                }
            </Grid>
        </Grid>
        <Grid>
            <UserActions />
        </Grid>
    </Grid>
  );
}

export default Details;


let cardDatas = [{
    title: 'NFTs',
    value: 12321,
    subValue: null
  }, {
    title: 'Floor Price',
    value: 9.734,
    subValue: null
  },
  {
    title: '7 Days Volume',
    value: 9.734,
    subValue: '$ 4,132,321'
  },

  {
    title: 'Pool TVL',
    value: 9.734,
    subValue: null
  },
  {
    title: 'Trading Fees',
    value: 9.734,
    subValue: null
  },
  {
    title: 'Swap Fees',
    value: 9.734,
    subValue: null
  },
  {
    title: 'Action Delta',
    value: 9.734,
    subValue: null
  },
  {
    title: '1 Day Change ',
    value: 9.734,
    subValue: null
  },
  {
    title: 'NFT Holder',
    value: 9.734,
    subValue: null
  }];