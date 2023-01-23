import React, { useEffect, useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import styles from "../details/style/Details.module.css";
import Azuki from "../../../static/images/azuki.jpeg";
import eth from "../../../static/images/eth.png";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import UserActions from "./src/user_actions/UserActions";
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider";
import { API } from "../contract/poolContract"

import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } from '@uniswap/sdk'


const Details = ({ address }) => {
  const router = useRouter();
  const [collection, setCollection] = useState({});
  const [ethPrice, setEthPrice] = useState(null);
  const [cardDatas, setCardDatas] = useState([]);
  const useToHome = () => {
    router.push("/");
  };

  let pool = {
    src: Azuki.src,
    address: "0x9117808F6ebEAeaE94DBcC2255C13db607f00F22",
    name: "Azuki",
  };
  useEffect(() => {
    async function fetchETHPrice() {
      const targetToken = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
      const pair = await Fetcher.fetchPairData(targetToken, WETH[targetToken.chainId])
      const route = new Route([pair], WETH[targetToken.chainId])
      console.log(route.midPrice.toSignificant(6)) // 201.306
      console.log(route.midPrice.invert().toSignificant(6)) // 0.00496756
      setEthPrice(route.midPrice.toSignificant(6))
    }
    fetchETHPrice();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      let res = await API.GetCollectionStats();
      let data = res.data;
      if (!data || !data.collection) return;
      setCollection(data.collection)
    }
    fetch();
  }, [])

  useEffect(() => {
    if (!collection || !ethPrice) return;
    const floorPrice = collection.stats.floor_price != null ? collection.stats.floor_price : 0;
    const floorPriceUSD = floorPrice * ethPrice;

    const volume7Day = collection.stats.seven_day_volume;
    const volume7DayUSD = volume7Day * floorPriceUSD;

    const sellerFee = Object.values(collection.fees.seller_fees).length != 0 ? Object.values(collection.fees.seller_fees)[0] : 0;

    const changeDay1 = collection.stats.one_day_change;
    const numOfOwners = collection.stats.num_owners;
    let cardDatas = [
      {
        title: "NFTs",
        value: collection.stats.total_supply,
        subValue: null,
      },
      {
        title: "Floor Price",
        value: floorPrice,
        subValue: `$ ${floorPriceUSD}`,
        coin: eth.src,
      },
      {
        title: "7 Days Volume",
        value: volume7Day,
        subValue: `$ ${volume7DayUSD}`,
        coin: eth.src,
      },
      {
        title: "Trading Fees",
        value: sellerFee,
        subValue: null,
      },
      {
        title: "Swap Fees",
        value: 9.734,
        subValue: null,
      },
      {
        title: "Action Delta",
        value: 9.734,
        subValue: null,
      },
      {
        title: "1 Day Change ",
        value: changeDay1,
        subValue: null,
      },
      {
        title: "NFT Holder",
        value: numOfOwners,
        subValue: null,
      },
    ];
    setCardDatas(cardDatas);
  }, [collection, ethPrice]);



  return (
    <Grid container className={styles.container}>
      <Grid container className={styles.upper_detail}>
        <Grid container className={styles.detail_intro}>
          <Grid xs={2} item={true}>
            <Avatar
              src={collection.image_url}
              alt="pool-logo"
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid xs={10} className={styles.details} item={true}>
            <div>
              <div>
                <p className={styles.text}>NFT Auction Liquidity Pool:</p>
              </div>
              <div>
                <p>{collection.name}</p>
              </div>
            </div>
            <div>
              <div>
                <p className={styles.text}>NFT Contract Address:</p>
              </div>
              <div>
                <p>{pool.address}</p>
              </div>
            </div>
          </Grid>
        </Grid>
        <Divider className={styles.divider} variant="middle" />
        <Grid container>
          {cardDatas.map((data) => {
            return (
              <Grid xs={2} key={data.title} item={true}>
                <p className={styles.text}>{data.title}</p>
                <p className={styles.value}>{data.value}</p>
                <p className={styles.sub_value}>{data.subValue ?? ""}</p>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid xs={12} className={styles.user_actions}>
        <UserActions pool={pool} />
      </Grid>
    </Grid>
  );
};

export default Details;