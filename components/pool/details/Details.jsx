// Permission. -> Allowance.  Use timestamp
// Update token balance after transaction finish.
import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, Avatar, Divider, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Popup from "reactjs-popup";
import { Contract } from "ethers";
import { ChainId, Fetcher, Route } from "@uniswap/sdk";
import UserBalance from "./UserBalance";
import UserActions from "./src/user_actions/UserActions";
import { useWeb3Context } from "../../../utils/web3-context";
import { getUniswapPair } from "../../../utils/contracts/token-slice";
import unipoolAbi from "../../../utils/abis/unipool.json";
import eth from "../../../static/images/eth.png";
import styles from "../details/style/Details.module.css";
import "reactjs-popup/dist/index.css";
import { usePool } from "../../../utils/contracts/pool-slice";

const Details = ({ nftPoolAddress }) => {
  if (!nftPoolAddress) return;

  const { account, provider, chainId } = useWeb3Context();
  const [collection, setCollection] = useState({});
  const [currencyTokenPrice, setCurrencyTokenPrice] = useState(0);
  const [cardDatas, setCardDatas] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [targetToken, setTargetToken] = useState(null);
  const [currencyToken, setCurrencyToken] = useState(null);
  const [nftPoolInfo, setNFTPoolInfo] = useState({});
  const [uniswapPairAddress, setUniswapPairAddress] = useState(null);

  const { data: pool } = usePool(nftPoolAddress);

  useEffect(() => {
    if (!targetToken || !currencyToken) return;

    const fetchCurrencyTokenPrice = async () => {
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setCurrencyTokenPrice(route.midPrice.toSignificant(6));
    };

    fetchCurrencyTokenPrice();
  }, [targetToken, currencyToken]);

  useEffect(() => {
    const fetchUniswapLiquidityPoolInfo = async () => {
      const pool = new Contract(
        uniswapPairAddress,
        unipoolAbi,
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
    };
    if (
      !account ||
      !provider ||
      chainId != ChainId.GÖRLI ||
      !uniswapPairAddress
    )
      return;
    fetchUniswapLiquidityPoolInfo();
  }, [account, provider, chainId, uniswapPairAddress]);

  useEffect(() => {
    const fetchNFTPoolStats = async () => {
      // TODO: fetch pool stats
      // let res = await API.GetCollectionStats();
      // let data = res.data;
      // if (!data || !data.collection) return;
      // setCollection(data.collection);
    };

    const fetchNFTPoolInfo = async () => {
      if (!nftPoolAddress) return;
      let nftPoolInfo = await fetchPoolInfo(nftPoolAddress);
      nftPoolInfo["name"] = "Test pool";
      setNFTPoolInfo(nftPoolInfo);
    };

    const fetchUniswapPairAddress = async () => {
      if (!pool.mappingToken) return;
      const address = await getUniswapPair(pool.mappingToken);
      setUniswapPairAddress(address);
    };
    fetchNFTPoolStats();
    fetchNFTPoolInfo();
    fetchUniswapPairAddress();
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
                <p>{uniswapPairAddress}</p>
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
      <UserBalance
        targetToken={targetToken}
        currencyToken={currencyToken}
        refresh={refresh}
      />
      <Grid xs={12} className={styles.user_actions}>
        <UserActions
          nftPoolInfo={nftPoolInfo}
          targetToken={targetToken}
          currencyToken={currencyToken}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
          refresh={refresh}
        />
      </Grid>
      <Popup
        open={errorMsg != null || successMsg != null}
        closeOnDocumentClick={true}
        onClose={() => {
          setErrorMsg(null);
          setSuccessMsg(null);
          setRefresh(refresh + 1);
        }}
        position="center"
      >
        {successMsg == null ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMsg}
          </Alert>
        ) : (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {successMsg}
          </Alert>
        )}
      </Popup>
    </Grid>
  );
};

export default Details;
