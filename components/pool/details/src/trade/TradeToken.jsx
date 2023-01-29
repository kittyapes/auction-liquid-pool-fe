import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import styles from "./style/Trade.module.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import IUniswapV2Router01 from "@uniswap/v2-periphery/build/IUniswapV2Router01.json";
import {
  getProvider,
  V2_SWAP_ROUTER_ADDRESS,
} from "../../../../pool/contract/poolContract";
import ERC20_ABI from "../../../../pool/contract/ERC20Abi.json";
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
  IERC20,
} from "@uniswap/sdk";

import {
  API,
  sendTransactionViaExtension,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
} from "../../../contract/poolContract";
import { ConstructionOutlined } from "@mui/icons-material";

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
    },
  },
})(TextField);

export default function TradeToken({
  targetToken,
  currencyToken,
  setErrorMsg,
}) {
  if (!targetToken || !currencyToken) return;
  const provider = getProvider();
  const { account } = useWeb3React();
  const [buyTargetTokenNumber, setBuyTargetTokenNumber] = useState(0);
  const [sellTargetTokenNumber, setSellTargetTokenNumber] = useState(0);
  const [buyCurrencyTokenNumber, setBuyCurrencyTokenNumber] = useState(0);
  const [sellCurrencyTokenNumber, setSellCurrencyTokenNumber] = useState(0);
  const [targetToCurrencyRatio, setTargetToCurrencyRatio] = useState(-1);
  const [liquidityTargetTokenNumber, setLiquidityTargetTokenNumber] =
    useState(0);
  const [liquidityCurrencyTokenNumber, setLiquidityCurrencyTokenNumber] =
    useState(0);
  const changeBuyTargetTokenNumber = (event) => {
    setBuyTargetTokenNumber(event.target.value);
  };

  const changeSellTargetTokenNumber = (event) => {
    setSellTargetTokenNumber(event.target.value);
  };

  const changeLiquidityTargetTokenNumber = (event) => {
    setLiquidityTargetTokenNumber(event.target.value);
    setLiquidityCurrencyTokenNumber(event.target.value * targetToCurrencyRatio);
  };

  const changeLiquidityCurrencyTokenNumber = (event) => {
    setLiquidityCurrencyTokenNumber(event.target.value);
  };

  const fetchTargetTokenPrice = async () => {
    console.log("start to fetchTargetTokenPrice");
    try {
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setTargetToCurrencyRatio(route.midPrice.invert().toSignificant(6));
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  /// Update the number of currency token users need to pay when
  /// users change the number of target token users want to buy.
  useEffect(() => {
    setBuyCurrencyTokenNumber(
      (buyTargetTokenNumber * targetToCurrencyRatio).toFixed(3)
    );
    setSellCurrencyTokenNumber(
      (sellTargetTokenNumber * targetToCurrencyRatio).toFixed(3)
    );
  }, [buyTargetTokenNumber, sellTargetTokenNumber]);

  const addLiquidity = async () => {
    try {
      const UniswapV2Router01 = new ethers.Contract(
        V2_SWAP_ROUTER_ADDRESS,
        JSON.stringify(IUniswapV2Router01.abi),
        provider.getSigner()
      );
      const bigNumberLiquidityTargetTokenNumber = ethers.utils.parseUnits(
        liquidityTargetTokenNumber.toString()
      );
      const bigNumberLiquidityCurrencyTokenNumber = ethers.utils.parseUnits(
        liquidityCurrencyTokenNumber.toString()
      );
      const targetTokenContract = new ethers.Contract(
        targetToken.address,
        JSON.stringify(ERC20_ABI),
        provider.getSigner()
      );
      const currencyContract = new ethers.Contract(
        currencyToken.address,
        JSON.stringify(ERC20_ABI),
        provider.getSigner()
      );
      await targetTokenContract.approve(
        V2_SWAP_ROUTER_ADDRESS,
        bigNumberLiquidityTargetTokenNumber
      );
      await currencyContract.approve(
        V2_SWAP_ROUTER_ADDRESS,
        bigNumberLiquidityCurrencyTokenNumber
      );

      // Fetch the up-to-date targetToken price.
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setTargetToCurrencyRatio(route.midPrice.invert().toSignificant(6));

      await UniswapV2Router01.addLiquidity(
        targetToken.address,
        currencyToken.address,
        ethers.utils.parseUnits(liquidityTargetTokenNumber.toString()),
        ethers.utils.parseUnits(liquidityCurrencyTokenNumber.toString()),
        0,
        0,
        account,
        Date.now() + 1000,
        {
          gasLimit: 2100000,
          gasPrice: MAX_PRIORITY_FEE_PER_GAS,
        }
      );
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
    }
  };

  const sellTargetToken = async () => {
    try {
      const UniswapV2Router01 = new ethers.Contract(
        V2_SWAP_ROUTER_ADDRESS,
        JSON.stringify(IUniswapV2Router01.abi),
        provider.getSigner()
      );
      const pair = await Fetcher.fetchPairData(currencyToken, targetToken);
      const route = new Route([pair], targetToken);
      const amountIn = sellTargetTokenNumber;
      const bigNumberAmountIn = ethers.utils.parseUnits(amountIn.toString());
      const trade = new Trade(
        route,
        new TokenAmount(targetToken, bigNumberAmountIn),
        TradeType.EXACT_INPUT
      );
      const slippageTolerance = new Percent("5000", "10000"); // 5000 bips, or 50%
      const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
      const bigNumberAmountOutMin = ethers.utils.parseUnits(
        amountOutMin.toString()
      );
      const path = [targetToken.address, currencyToken.address];
      const to = account; // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      const targetTokenContract = new ethers.Contract(
        targetToken.address,
        JSON.stringify(ERC20_ABI),
        provider.getSigner()
      );
      await targetTokenContract.approve(
        V2_SWAP_ROUTER_ADDRESS,
        bigNumberAmountIn
      );
      await UniswapV2Router01.swapExactTokensForTokens(
        bigNumberAmountIn,
        0, // bigNumberAmountOutMin, //amountOutMin
        path,
        to,
        deadline,
        {
          gasLimit: 2100000,
          gasPrice: MAX_PRIORITY_FEE_PER_GAS,
        }
      );
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
    }
    fetchTargetTokenPrice();
  };

  const buyTargetToken = async () => {
    try {
      const UniswapV2Router01 = new ethers.Contract(
        V2_SWAP_ROUTER_ADDRESS,
        JSON.stringify(IUniswapV2Router01.abi),
        provider.getSigner()
      );
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      const amountOut = buyTargetTokenNumber;
      const bigNumberAmountOut = ethers.utils.parseUnits(amountOut.toString());
      const trade = new Trade.exactOut(
        route,
        new TokenAmount(targetToken, bigNumberAmountOut)
      );
      const slippageTolerance = new Percent("5000", "10000"); // 5000 bips, or 50%
      const amountInMax = trade.maximumAmountIn(slippageTolerance).raw; // needs to be converted to e.g. hex
      const bigNumberAmountInMax = ethers.utils.parseUnits(
        amountInMax.toString()
      );
      const path = [currencyToken.address, targetToken.address];
      const to = account; // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      const currencyTokenContract = new ethers.Contract(
        currencyToken.address,
        JSON.stringify(ERC20_ABI),
        provider.getSigner()
      );
      await currencyTokenContract.approve(
        V2_SWAP_ROUTER_ADDRESS,
        bigNumberAmountInMax
      );
      await UniswapV2Router01.swapTokensForExactTokens(
        bigNumberAmountOut,
        bigNumberAmountInMax, // bigNumberAmountOutMin, //amountOutMin
        path,
        to,
        deadline,
        {
          gasLimit: 2100000,
          gasPrice: MAX_PRIORITY_FEE_PER_GAS,
        }
      );
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
    }
    fetchTargetTokenPrice();
  };

  useEffect(() => {
    fetchTargetTokenPrice();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }} className={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: 2,
              p: 2,
              backgroundColor: "rgba(20, 17, 25, 1)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                paddingTop: 1,
                fontSize: "rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              {`Buy  $${targetToken.name} with ${currencyToken.name}`}
            </Box>
            <div
              className={styles.placeholder}
              data-placeholder={targetToken.name}
            >
              <CssTextField
                sx={{
                  marginTop: 2,
                  display: "flex",
                  fontSize: "1rem",
                  fontWeight: "700",
                  input: { color: "white" },
                }}
                id="outlined-basic"
                variant="outlined"
                fullWidth
                placehoder={0}
                value={buyTargetTokenNumber}
                onChange={changeBuyTargetTokenNumber}
                type="number"
              />
            </div>
            <Box sx={{ height: 60, marginTop: 1 }}></Box>
            <Box
              sx={{
                display: "flex",
                marginTop: 1,
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "Poppins",
                fontSize: "0.7rem",
                fontWeight: "700",
              }}
            >
              {buyCurrencyTokenNumber} {currencyToken.name}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
              onClick={buyTargetToken}
            >
              Buy
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: 2,
              p: 2,
              backgroundColor: "rgba(20, 17, 25, 1)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                paddingTop: 1,
                fontSize: "1rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              {`Sell  $${targetToken.name} with ${currencyToken.name}`}
            </Box>
            <div
              className={styles.placeholder}
              data-placeholder={targetToken.name}
            >
              <CssTextField
                sx={{
                  marginTop: 2,
                  display: "flex",
                  fontSize: "1rem",
                  fontWeight: "700",
                  height: 60,
                  input: { color: "white" },
                }}
                id="outlined-basic"
                fullWidth
                variant="outlined"
                placehoder={0}
                value={sellTargetTokenNumber}
                onChange={changeSellTargetTokenNumber}
                type="number"
              />
            </div>
            <Box sx={{ height: 60, marginTop: 1 }}></Box>
            <Box
              sx={{
                display: "flex",
                marginTop: 1,
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "Poppins",
                fontSize: "0.7rem",
                fontWeight: "700",
              }}
            >
              {sellCurrencyTokenNumber} {currencyToken.name}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
              onClick={sellTargetToken}
            >
              Sell
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: 2,
              p: 2,
              backgroundColor: "rgba(20, 17, 25, 1)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                paddingTop: 1,
                fontSize: "1rem",
                fontWeight: "700",
                color: "white",
              }}
            >
              {`Stake  $${targetToken.name} with ${currencyToken.name}`}
            </Box>
            <div
              className={styles.placeholder}
              data-placeholder={targetToken.name}
            >
              <CssTextField
                sx={{
                  marginTop: 2,
                  display: "flex",
                  fontSize: "1rem",
                  fontWeight: "700",
                  input: { color: "white" },
                }}
                id="outlined-basic"
                fullWidth
                variant="outlined"
                value={liquidityTargetTokenNumber}
                onChange={changeLiquidityTargetTokenNumber}
              />
            </div>
            <div
              className={styles.placeholder}
              data-placeholder={currencyToken.name}
            >
              <CssTextField
                sx={{
                  marginTop: 2,
                  display: "flex",
                  fontSize: "1rem",
                  fontWeight: "700",
                  input: { color: "white" },
                }}
                id="outlined-basic"
                fullWidth
                variant="outlined"
                value={liquidityCurrencyTokenNumber}
                onChange={changeLiquidityCurrencyTokenNumber}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                marginTop: 1,
                color: "rgba(255, 255, 255, 0.4)",
                fontFamily: "Poppins",
                fontSize: "0.7rem",
                fontWeight: "700",
              }}
            >
              {"0.3% Interest Rate"}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
              onClick={addLiquidity}
            >
              Stake
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
