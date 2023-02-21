import React, { useEffect, useState } from "react";
import { withStyles } from "@mui/styles";
import { Box, Button, Grid, Skeleton, TextField } from "@mui/material";
import { BigNumber, Contract, utils } from "ethers";
import {
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk";
import IUniswapV2Router01 from "@uniswap/v2-periphery/build/IUniswapV2Router01.json";
import {
  MAX_PRIORITY_FEE_PER_GAS,
  UNI_V2_ROUTER,
} from "../../../../../utils/constants";
import { useWeb3Context } from "../../../../../utils/web3-context";
import { getTxStatus } from "../../../../../utils/contracts/pool-slice";
import {
  approveToken,
  getBalance,
} from "../../../../../utils/contracts/token-slice";
import styles from "./style/Trade.module.css";

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
  setSuccessMsg,
  refresh,
}) {
  if (!targetToken || !currencyToken) return;
  const { account, provider, pendingTxs, setPendingTxs } = useWeb3Context();
  const [loading, setLoading] = useState(true);
  const [buyTargetAmount, setBuyTargetAmount] = useState(0);
  const [sellTargetAmount, setSellTargetAmount] = useState(0);
  const [buyCurrencyAmount, setBuyCurrencyAmount] = useState(0);
  const [sellCurrencyAmount, setSellCurrencyAmount] = useState(0);
  const [targetToCurrencyRatio, setTargetToCurrencyRatio] = useState(0);
  const [liquidityTargetAmount, setLiquidityTargetAmount] = useState(0);
  const [liquidityCurrencyAmount, setLiquidityCurrencyAmount] = useState(0);
  const [targetTokenBalance, setTargetTokenBalance] = useState(0);
  const [currencyTokenBalance, setCurrencyTokenBalance] = useState(0);

  const changeBuyTargetAmount = (event) => {
    setBuyTargetAmount(event.target.value);
  };

  const changeSellTargetAmount = (event) => {
    setSellTargetAmount(event.target.value);
  };

  const changeLiquidityTargetAmount = (event) => {
    setLiquidityTargetAmount(event.target.value);
    setLiquidityCurrencyAmount(event.target.value * targetToCurrencyRatio);
  };

  const changeLiquidityCurrencyAmount = (event) => {
    setLiquidityCurrencyAmount(event.target.value);
  };

  const fetchTargetTokenPrice = async () => {
    console.log("start to fetchTargetTokenPrice");
    try {
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setTargetToCurrencyRatio(route.midPrice.invert().toSignificant(6));
      console.log(`Get new ratio: ${route.midPrice.invert().toSignificant(6)}`);
    } catch (e) {
      console.log(e);
      // setErrorMsg(e.message);
    }
  };

  const fetchUserWalletTargetTokenBalance = async () => {
    const balance = await getBalance(targetToken.address, account);
    setTargetTokenBalance(Math.floor(utils.formatEther(balance)));
    console.log(
      `Get user mapping T balance:${Math.floor(utils.formatEther(balance))}`
    );
  };

  const fetchUserWalletCurrencyTokenBalance = async () => {
    const balance = await getBalance(currencyToken.address, account);
    setCurrencyTokenBalance(utils.formatEther(balance));
    console.log(`Get user dex balance:${utils.formatEther(balance)}`);
  };

  /// Update the number of currency token users need to pay when
  /// users change the number of target token users want to buy.
  useEffect(() => {
    setBuyCurrencyAmount((buyTargetAmount * targetToCurrencyRatio).toFixed(3));
    setSellCurrencyAmount(
      (sellTargetAmount * targetToCurrencyRatio).toFixed(3)
    );
  }, [buyTargetAmount, sellTargetAmount, targetToCurrencyRatio]);

  const addLiquidity = async () => {
    try {
      const UniswapV2Router01 = new Contract(
        UNI_V2_ROUTER,
        JSON.stringify(IUniswapV2Router01.abi),
        provider.getSigner()
      );
      const targetAmount = BigNumber.from(liquidityTargetAmount.toString());
      const currencyAmount = BigNumber.from(liquidityCurrencyAmount.toString());
      await approveToken(
        provider,
        targetToken.address,
        UNI_V2_ROUTER,
        targetAmount
      );
      await approveToken(
        provider,
        currencyToken.address,
        UNI_V2_ROUTER,
        currencyAmount
      );

      // Fetch the up-to-date targetToken price.
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      setTargetToCurrencyRatio(route.midPrice.invert().toSignificant(6));

      const transaction = await UniswapV2Router01.addLiquidity(
        targetToken.address,
        currencyToken.address,
        targetAmount,
        currencyAmount,
        0,
        0,
        account,
        Date.now() + 1000,
        {
          gasLimit: 2100000,
          gasPrice: MAX_PRIORITY_FEE_PER_GAS,
        }
      );
      // Append current tx into pending tx list.
      setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
      getTxStatus(transaction.hash, async () => {
        setSuccessMsg(`Transaction succeeded! hash:${transaction.hash}`);
        pendingTxs.delete(transaction.hash);
        setPendingTxs(new Set([...pendingTxs]));
      });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
    }
  };

  const sellTargetToken = async () => {
    try {
      const UniswapV2Router01 = new Contract(
        UNI_V2_ROUTER,
        JSON.stringify(IUniswapV2Router01.abi),
        provider.getSigner()
      );
      const pair = await Fetcher.fetchPairData(currencyToken, targetToken);
      const route = new Route([pair], targetToken);
      const amountIn = sellTargetAmount;
      const bnAmountIn = BigNumber.from(amountIn.toString());
      const trade = new Trade(
        route,
        new TokenAmount(targetToken, bnAmountIn),
        TradeType.EXACT_INPUT
      );
      const slippageTolerance = new Percent("5000", "10000"); // 5000 bips, or 50%
      const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
      const bnAmountOutMin = BigNumber.from(amountOutMin.toString());
      const path = [targetToken.address, currencyToken.address];
      const to = account; // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      await approveToken(
        provider,
        targetToken.address,
        UNI_V2_ROUTER,
        bnAmountIn
      );
      const transaction = await UniswapV2Router01.swapExactTokensForTokens(
        bnAmountIn,
        0, // bnAmountOutMin, //amountOutMin
        path,
        to,
        deadline,
        {
          gasLimit: 2100000,
          gasPrice: MAX_PRIORITY_FEE_PER_GAS,
        }
      );
      // Append current tx into pending tx list.
      setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
      getTxStatus(transaction.hash, async () => {
        setSuccessMsg(`Transaction succeeded! hash:${transaction.hash}`);
        pendingTxs.delete(transaction.hash);
        setPendingTxs(new Set([...pendingTxs]));
      });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
    }
  };

  const buyTargetToken = async () => {
    try {
      const UniswapV2Router01 = new Contract(
        UNI_V2_ROUTER,
        JSON.stringify(IUniswapV2Router01.abi),
        provider.getSigner()
      );
      const pair = await Fetcher.fetchPairData(targetToken, currencyToken);
      const route = new Route([pair], currencyToken);
      const amountOut = buyTargetAmount;
      const bnAmountOut = BigNumber.from(amountOut.toString());
      const trade = new Trade.exactOut(
        route,
        new TokenAmount(targetToken, bnAmountOut)
      );
      const slippageTolerance = new Percent("5000", "10000"); // 5000 bips, or 50%
      const amountInMax = trade.maximumAmountIn(slippageTolerance).raw; // needs to be converted to e.g. hex
      const bnAmountInMax = BigNumber.from(amountInMax.toString());
      const path = [currencyToken.address, targetToken.address];
      const to = account; // should be a checksummed recipient address
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
      await approveToken(
        provider,
        currencyToken.address,
        UNI_V2_ROUTER,
        bnAmountInMax
      );
      let transactionHash = await UniswapV2Router01.swapTokensForExactTokens(
        bnAmountOut,
        bnAmountInMax, // bnAmountOutMin, //amountOutMin
        path,
        to,
        deadline,
        {
          gasLimit: 2100000,
          gasPrice: MAX_PRIORITY_FEE_PER_GAS,
        }
      );
      // Append current tx into pending tx list.
      console.log("setPendingTxs");
      setPendingTxs(new Set([transactionHash.hash, ...pendingTxs]));
      getTxStatus(transactionHash.hash, async () => {
        setSuccessMsg(`Transaction succeeded! hash:${transactionHash.hash}`);
        pendingTxs.delete(transactionHash.hash);
        setPendingTxs(new Set([...pendingTxs]));
      });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUserWalletTargetTokenBalance(),
      fetchUserWalletCurrencyTokenBalance(),
      fetchTargetTokenPrice(),
    ]).then((_) => {
      console.log("finish all balance fetching!!");
      setLoading(false);
    });
  }, [refresh]);

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
                placeholder={0}
                value={buyTargetAmount}
                onChange={changeBuyTargetAmount}
                type="number"
              />
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ marginRight: "8px" }}>Max:</span>
              {loading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    display: "flex",
                    bgcolor: "white",
                    width: "20px",
                  }}
                />
              ) : currencyTokenBalance && targetToCurrencyRatio ? (
                Math.floor(currencyTokenBalance / targetToCurrencyRatio)
              ) : (
                0
              )}
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
              Cost: {buyCurrencyAmount} {currencyToken.name}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
              disabled={
                buyTargetAmount * targetToCurrencyRatio > currencyTokenBalance
              }
              onClick={buyTargetToken}
            >
              {buyTargetAmount * targetToCurrencyRatio > currencyTokenBalance
                ? "Insufficient Balance"
                : "Buy"}
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
                placeholder={0}
                value={sellTargetAmount}
                onChange={changeSellTargetAmount}
                type="number"
              />
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ marginRight: "8px" }}>Max:</span>
              {loading ? (
                <Skeleton
                  variant="text"
                  sx={{
                    display: "flex",
                    bgcolor: "white",
                    width: "20px",
                  }}
                />
              ) : (
                targetTokenBalance
              )}
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
              Get: {sellCurrencyAmount} {currencyToken.name}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              disabled={sellTargetAmount > targetTokenBalance}
              fullWidth
              onClick={sellTargetToken}
            >
              {sellTargetAmount > targetTokenBalance
                ? "Insufficient Balance"
                : "Sell"}
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
                value={liquidityTargetAmount}
                onChange={changeLiquidityTargetAmount}
              />
              <div style={{ display: "flex" }}>
                <span style={{ marginRight: "8px" }}>Max:</span>
                {loading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      display: "flex",
                      bgcolor: "white",
                      width: "20px",
                    }}
                  />
                ) : (
                  targetTokenBalance
                )}
              </div>
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
                value={liquidityCurrencyAmount}
                onChange={changeLiquidityCurrencyAmount}
              />
              <div style={{ display: "flex" }}>
                <span style={{ marginRight: "8px" }}>Max:</span>
                {loading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      display: "flex",
                      bgcolor: "white",
                      width: "20px",
                    }}
                  />
                ) : (
                  Math.floor(currencyTokenBalance)
                )}
              </div>
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
            ></Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
              disabled={
                liquidityTargetAmount > targetTokenBalance ||
                liquidityCurrencyAmount > currencyTokenBalance
              }
              onClick={addLiquidity}
            >
              {liquidityTargetAmount > targetTokenBalance
                ? `Insufficient ${targetToken.name} token balance`
                : liquidityCurrencyAmount > currencyTokenBalance
                ? `Insufficient ${currencyToken.name} Balance`
                : "Stake"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
