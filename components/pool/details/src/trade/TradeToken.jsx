import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import styles from "./style/Trade.module.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import IUniswapV2Router01 from "@uniswap/v2-periphery/build/IUniswapV2Router01.json";
import { getProvider } from "../../../../pool/contract/poolContract";
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
} from "@uniswap/sdk";

import {
  API,
  sendTransactionViaExtension,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
} from "../../../contract/poolContract";

const currencyToken = new Token(
  ChainId.GÖRLI,
  "0x334E2D204EaF5EF89F0AD7b4DaC167Bf8Fcc752e",
  18,
  "DEX",
  "DEX"
);

const targetToken = new Token(
  ChainId.GÖRLI,
  "0xA2F60f9e9FdcA8226e6749fA1783EAbCDB6031a2",
  18,
  "MAPT",
  "MAPT"
);
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

export default function TradeToken() {
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
  };

  const changeLiquidityCurrencyTokenNumber = (event) => {
    setLiquidityCurrencyTokenNumber(event.target.value);
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

  useEffect(() => {
    async function fetchTargetTokenPrice() {
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      const trade = new Trade(
        route,
        new TokenAmount(currencyToken, "1000000000000000000"),
        TradeType.EXACT_INPUT
      );
      setTargetToCurrencyRatio(route.midPrice.toSignificant(6));
    }
    fetchTargetTokenPrice();
  }, []);
  const addLiquidity = async () => {
    const UniswapV2Router01 = new ethers.Contract(
      "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a",
      JSON.stringify(IUniswapV2Router01.abi),
      provider.getSigner()
    );
    console.log("UniswapV2Router01");
    console.log(UniswapV2Router01);
    console.log(ethers.utils.parseUnits("10"));
    const res = await UniswapV2Router01.addLiquidity(
      targetToken.address,
      currencyToken.address,
      ethers.utils.parseUnits(liquidityTargetTokenNumber.toString()),
      ethers.utils.parseUnits(liquidityCurrencyTokenNumber.toString()),
      0,
      0,
      account,
      Date.now() + 1000
    );
  };
  const buyTargetToken = async () => {
    const targetToken = new Token(
      ChainId.GÖRLI,
      "0xA2F60f9e9FdcA8226e6749fA1783EAbCDB6031a2",
      18,
      "dex",
      "dex"
    );
    const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
    const route = new Route([pair], currencyToken);
    const trade = new Trade(
      route,
      new TokenAmount(currencyToken, "1000000000000000000"),
      TradeType.EXACT_INPUT
    );

    console.log(route.midPrice.toSignificant(6)); // 201.306
    console.log(route.midPrice.invert().toSignificant(6)); // 0.00496756

    console.log(trade.executionPrice.toSignificant(6));
    console.log(trade.nextMidPrice.toSignificant(6));

    const amountIn = "1000000000000000000"; // 1 dex

    const slippageTolerance = new Percent("50", "10000"); // 50 bips, or 0.50%
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const path = [WETH[targetToken.chainId].address, targetToken.address];
    const to = account; // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
    const web3 = new Web3(window.ethereum);
    const nonce = await web3.eth.getTransactionCount(account, "latest");
    const transaction = {
      to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      from: to,
      value: value.toString(16),
      gas: MAX_FEE_PER_GAS,
      gasPrice: MAX_PRIORITY_FEE_PER_GAS,
      nonce: nonce.toString(),
    };
    const res = await sendTransactionViaExtension(transaction);
    return res;
  };

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
                value={buyTargetTokenNumber}
                onChange={changeBuyTargetTokenNumber}
                type="number"
              />
            </div>

            {/* <CssTextField
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                input: { color: 'white' }
                            }}
                            id="outlined-basic"
                            fullWidth
                            variant="outlined"
                            value={buyCurrencyTokenNumber}
                            onChange={changeBuyCurrencyTokenNumber}
                            type="number" /> USDC */}
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
                value={sellTargetTokenNumber}
                onChange={changeSellTargetTokenNumber}
                type="number"
              />{" "}
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
              {"33% Interest Rate"}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
            >
              Stake
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
