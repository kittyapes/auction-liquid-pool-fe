import React, { useEffect, useState, useRef, Suspense } from "react";
import Box from "@mui/material/Box";
import styles from "./style/Trade.module.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useWalletContext } from "../../../../../utils/wallet-context";
import IUniswapV2Router01 from "@uniswap/v2-periphery/build/IUniswapV2Router01.json";
import {
  getProvider,
  getContract,
  getTransactionStatus,
  getWebSocket,
  V2_SWAP_ROUTER_ADDRESS,
} from "../../../../pool/contract/poolContract";
import Skeleton from "@mui/material/Skeleton";
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
  InsufficientInputAmountError,
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
  setSuccessMsg,
  refresh,
}) {
  if (!targetToken || !currencyToken) return;
  const provider = getProvider();
  const webSocket = getWebSocket();
  const [loading, setLoading] = useState(true);
  const { account, pendingTxs, setPendingTxs } = useWalletContext();
  const [buyTargetTokenNumber, setBuyTargetTokenNumber] = useState(0);
  const [sellTargetTokenNumber, setSellTargetTokenNumber] = useState(0);
  const [buyCurrencyTokenNumber, setBuyCurrencyTokenNumber] = useState(0);
  const [sellCurrencyTokenNumber, setSellCurrencyTokenNumber] = useState(0);
  const [targetToCurrencyRatio, setTargetToCurrencyRatio] = useState(0);
  const [liquidityTargetTokenNumber, setLiquidityTargetTokenNumber] =
    useState(0);
  const [liquidityCurrencyTokenNumber, setLiquidityCurrencyTokenNumber] =
    useState(0);
  const [targetTokenBalance, setTargetTokenBalance] = useState(0);
  const [currencyTokenBalance, setCurrencyTokenBalance] = useState(0);

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
      console.log(`Get new ratio: ${route.midPrice.invert().toSignificant(6)}`);
    } catch (e) {
      console.log(e);
      // setErrorMsg(e.message);
    }
  };

  async function fetchUserWalletTargetTokenBalance() {
    const tokenContract = getContract(targetToken.address);
    const balance = await tokenContract.balanceOf(account);
    setTargetTokenBalance(Math.floor(ethers.utils.formatUnits(balance)));
    console.log(
      `Get user mapping T balance:${Math.floor(
        ethers.utils.formatUnits(balance)
      )}`
    );
  }

  async function fetchUserWalletCurrencyTokenBalance() {
    const tokenContract = getContract(currencyToken.address);
    const balance = await tokenContract.balanceOf(account);
    setCurrencyTokenBalance(ethers.utils.formatUnits(balance));
    console.log(`Get user dex balance:${ethers.utils.formatUnits(balance)}`);
  }

  /// Update the number of currency token users need to pay when
  /// users change the number of target token users want to buy.
  useEffect(() => {
    setBuyCurrencyTokenNumber(
      (buyTargetTokenNumber * targetToCurrencyRatio).toFixed(3)
    );
    setSellCurrencyTokenNumber(
      (sellTargetTokenNumber * targetToCurrencyRatio).toFixed(3)
    );
  }, [buyTargetTokenNumber, sellTargetTokenNumber, targetToCurrencyRatio]);

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

      const transaction = await UniswapV2Router01.addLiquidity(
        targetToken.address,
        currencyToken.address,
        bigNumberLiquidityTargetTokenNumber,
        bigNumberLiquidityCurrencyTokenNumber,
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
      getTransactionStatus(transaction.hash, async () => {
        setSuccessMsg(`Transction successded! hash:${transaction.hash}`);
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
      const transaction = await UniswapV2Router01.swapExactTokensForTokens(
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
      // Append current tx into pending tx list.
      setPendingTxs(new Set([transaction.hash, ...pendingTxs]));
      getTransactionStatus(transaction.hash, async () => {
        setSuccessMsg(`Transction successded! hash:${transaction.hash}`);
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
      let transactionHash = await UniswapV2Router01.swapTokensForExactTokens(
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
      // Append current tx into pending tx list.
      console.log("setPendingTxs");
      setPendingTxs(new Set([transactionHash.hash, ...pendingTxs]));
      getTransactionStatus(transactionHash.hash, async () => {
        setSuccessMsg(`Transction successded! hash:${transactionHash.hash}`);
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
  const formatFloatNumber = (x) => Number.parseFloat(x).toFixed(0);
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
              Cost: {buyCurrencyTokenNumber} {currencyToken.name}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              fullWidth
              disabled={
                buyTargetTokenNumber * targetToCurrencyRatio >
                currencyTokenBalance
              }
              onClick={buyTargetToken}
            >
              {buyTargetTokenNumber * targetToCurrencyRatio >
              currencyTokenBalance
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
                placehoder={0}
                value={sellTargetTokenNumber}
                onChange={changeSellTargetTokenNumber}
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
              Get: {sellCurrencyTokenNumber} {currencyToken.name}
            </Box>
            <Button
              sx={{ marginTop: 2, height: 60 }}
              variant="contained"
              size="large"
              disabled={sellTargetTokenNumber > targetTokenBalance}
              fullWidth
              onClick={sellTargetToken}
            >
              {sellTargetTokenNumber > targetTokenBalance
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
                value={liquidityTargetTokenNumber}
                onChange={changeLiquidityTargetTokenNumber}
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
                value={liquidityCurrencyTokenNumber}
                onChange={changeLiquidityCurrencyTokenNumber}
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
                liquidityTargetTokenNumber > targetTokenBalance ||
                liquidityCurrencyTokenNumber > currencyTokenBalance
              }
              onClick={addLiquidity}
            >
              {liquidityTargetTokenNumber > targetTokenBalance
                ? `Insufficient ${targetToken.name} token balance`
                : liquidityCurrencyTokenNumber > currencyTokenBalance
                ? `Insufficient ${currencyToken.name} Balance`
                : "Stake"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
