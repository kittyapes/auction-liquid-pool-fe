// Permission. -> Allowance.  Use timestamp
// Update token balance after transactoin finish.
import React, { useEffect, useState } from "react";
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
import {
  getProvider,
  getTokenInfo,
  fetchPoolInfo,
} from "../../pool/contract/poolContract";
import { useWalletContext } from "../../../context/wallet";
import { ethers } from "ethers";
import { ChainId, Token, Fetcher, Route } from "@uniswap/sdk";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";
import UserBanalce from "./UserBalance";
let pool = {
  src: Azuki.src,
  address: "0x69a8fB7aB0672693C70a4a4DC31f51fCb22258Fb",
  name: "Azuki",
};

const nftPoolAddress = "0x22D5dc826145166f7cbDfBf14CFE9a43dA02Ea25";
const Details = ({ pairAddress }) => {
  pairAddress = "0x0aE03567Bc0C8cFD3e3A174B21e3678d06Cb9A88";
  const provider = getProvider();
  const router = useRouter();
  const { account, chainId } = useWalletContext();
  const [collection, setCollection] = useState({});
  const [currencyTokenPrice, setCurrencyTokenPrice] = useState(0);
  const [cardDatas, setCardDatas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [targetToken, setTargetToken] = useState(null);
  const [currencyToken, setCurrencyToken] = useState(null);
  const [poolInfo, setPoolInfo] = useState({});
  const useToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    if (!targetToken || !currencyToken) return;
    async function fetchCurrencyTokenPrice() {
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setCurrencyTokenPrice(route.midPrice.toSignificant(6));
    }
    fetchCurrencyTokenPrice();
  }, [targetToken, currencyToken]);

  useEffect(() => {
    async function fetchUniswapLiquidityPoolInfo() {
      const pool = new ethers.Contract(
        pairAddress,
        uniswapLiquidityPoolAbi,
        provider.getSigner()
      );
      const targetTokenAddress = await pool.token1();
      const currencyTokenAddress = await pool.token0();
      const t = await getTokenInfo(targetTokenAddress);
      const c = await getTokenInfo(currencyTokenAddress);
      setTargetToken(t);
      setCurrencyToken(c);
      let targetTokenBalance = await pool.balanceOf(targetTokenAddress);
      let currencyTokenBalance = await pool.balanceOf(currencyTokenAddress);
      //TODO: Show balance in the detail page.
    }
    if (!account || chainId != ChainId.GÖRLI) return;
    fetchUniswapLiquidityPoolInfo();
  }, [account, chainId]);

  useEffect(() => {
    const fetchNFTPoolStats = async () => {
      let res = await API.GetCollectionStats();
      let data = res.data;
      if (!data || !data.collection) return;
      setCollection(data.collection);
    };

    const fetchNFTPoolInfo = async (poolAddress) => {
      let poolInfo = await fetchPoolInfo(poolAddress);
      poolInfo["name"] = "Test pool";
      setPoolInfo(poolInfo);
    };
    fetchNFTPoolStats();
    fetchNFTPoolInfo(nftPoolAddress);
  }, []);

  useEffect(() => {
    if (!collection || !currencyTokenPrice) return;
    const floorPrice =
      collection.stats.floor_price != null ? collection.stats.floor_price : 0;
    const floorPriceUSD = floorPrice * currencyTokenPrice;

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
  }, [collection, currencyTokenPrice]);

  return account == null ? (
    <p className={styles.banner}>Connect Wallet</p>
  ) : chainId != ChainId.GÖRLI ? (
    <p className={styles.banner}>Please switch to Goerli Testnet</p>
  ) : (
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
                <p>{pairAddress}</p>
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
      <Divider className={styles.dividerFull} variant="middle" />
      <UserBanalce targetToken={targetToken} currencyToken={currencyToken} />
      <Grid xs={12} className={styles.user_actions}>
        <UserActions
          pool={poolInfo}
          targetToken={targetToken}
          currencyToken={currencyToken}
          setErrorMsg={setErrorMsg}
        />
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
