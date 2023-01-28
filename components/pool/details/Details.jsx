import React, { useEffect, useState, useRef } from "react";
import styles from "../details/style/Details.module.css";
import Azuki from "../../../static/images/azuki.jpeg";
import eth from "../../../static/images/eth.png";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import UserActions from "./src/user_actions/UserActions";
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider";
import { API } from "../contract/poolContract";
import uniswapLiquidityPoolAbi from "../../../contracts/uniswapLiquidityPoolAbi.json";
import { getProvider } from "../../pool/contract/poolContract";
import { ethers } from "ethers";
import { ChainId, Token, Fetcher, Route } from "@uniswap/sdk";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";
const Details = ({ address }) => {
  const provider = getProvider();
  const router = useRouter();
  const [collection, setCollection] = useState({});
  const [ethPrice, setEthPrice] = useState(null);
  const [cardDatas, setCardDatas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
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
      const targetToken = new Token(
        ChainId.GÖRLI,
        "0xA2F60f9e9FdcA8226e6749fA1783EAbCDB6031a2",
        18,
        "dex",
        "dex"
      );
      const currencyToken = new Token(
        ChainId.GÖRLI,
        "0x334E2D204EaF5EF89F0AD7b4DaC167Bf8Fcc752e",
        18,
        "token",
        "token"
      );
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setEthPrice(route.midPrice.toSignificant(6));
    }
    fetchETHPrice();

    async function fetchUniswapLiquidityPoolInfo() {
      const pool = new ethers.Contract(
        "0x0aE03567Bc0C8cFD3e3A174B21e3678d06Cb9A88",
        uniswapLiquidityPoolAbi,
        provider.getSigner()
      );
      let targetTokenBalance = await pool.balanceOf(
        "0xA2F60f9e9FdcA8226e6749fA1783EAbCDB6031a2"
      );
      let currencyTokenBalance = await pool.balanceOf(
        "0x334E2D204EaF5EF89F0AD7b4DaC167Bf8Fcc752e"
      );
      //TODO: Show balance in the detail page.
    }
    fetchUniswapLiquidityPoolInfo();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      let res = await API.GetCollectionStats();
      let data = res.data;
      if (!data || !data.collection) return;
      setCollection(data.collection);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!collection || !ethPrice) return;
    const floorPrice =
      collection.stats.floor_price != null ? collection.stats.floor_price : 0;
    const floorPriceUSD = floorPrice * ethPrice;

    const volume7Day = collection.stats.seven_day_volume;
    const volume7DayUSD = volume7Day * floorPriceUSD;

    const sellerFee =
      Object.values(collection.fees.seller_fees).length != 0
        ? Object.values(collection.fees.seller_fees)[0]
        : 0;

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
        <UserActions pool={pool} setErrorMsg={setErrorMsg} />
      </Grid>
      <Popup
        open={errorMsg != null}
        closeOnDocumentClick={true}
        onClose={() => {
          setErrorMsg(null);
        }}
        position="center"
      >
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorMsg}
        </Alert>
      </Popup>
    </Grid>
  );
};

export default Details;
