import React, { useEffect, useState, useRef } from "react";
import Box from '@mui/material/Box';
import styles from "./style/Trade.module.css";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } from '@uniswap/sdk'
import { API, sendTransactionViaExtension, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from "../../../contract/poolContract";
const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3);',
                borderWidth: '2px'
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3);',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3);',
            }
        },
    },
})(TextField);

export default function TradeToken() {
    const { account } = useWeb3React();
    const [buyTargetTokenNumber, setBuyTargetTokenNumber] = useState(0);
    const [sellTargetTokenNumber, setSellTargetTokenNumber] = useState(0);
    const [buyCurrencyTokenNumber, setBuyCurrencyTokenNumber] = useState(0);
    const [sellCurrencyTokenNumber, setSellCurrencyTokenNumber] = useState(0);
    const [targetToCurrencyRatio, setTargetToCurrencyRatio] = useState(-1);
    const targetToken = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
    const changeBuyTargetTokenNumber = (event) => {
        setBuyTargetTokenNumber(event.target.value);
    }

    const changeSellTargetTokenNumber = (event) => {
        setSellTargetTokenNumber(event.target.value);
    }

    /// Update the number of currency token users need to pay when
    /// users change the number of target token users want to buy.
    useEffect(() => {
        setBuyCurrencyTokenNumber((buyTargetTokenNumber * targetToCurrencyRatio).toFixed(3));
        setSellCurrencyTokenNumber((sellTargetTokenNumber * targetToCurrencyRatio).toFixed(3));
    }, [buyTargetTokenNumber, sellTargetTokenNumber])

    useEffect(() => {
        async function fetchTargetTokenPrice() {
            const pair = await Fetcher.fetchPairData(targetToken, WETH[targetToken.chainId])
            const route = new Route([pair], WETH[targetToken.chainId])
            const trade = new Trade(route, new TokenAmount(WETH[targetToken.chainId], '1000000000000000000'), TradeType.EXACT_INPUT)
            console.log(route.midPrice.toSignificant(6)) // 201.306
            console.log(route.midPrice.invert().toSignificant(6)) // 0.00496756

            console.log(trade.executionPrice.toSignificant(6))
            console.log(trade.nextMidPrice.toSignificant(6))
            setTargetToCurrencyRatio(route.midPrice.toSignificant(6))
        }
        fetchTargetTokenPrice();
    }, []);


    const buyTargetToken = async () => {
        const pair = await Fetcher.fetchPairData(targetToken, WETH[targetToken.chainId])
        const route = new Route([pair], WETH[targetToken.chainId])
        const trade = new Trade(route, new TokenAmount(WETH[targetToken.chainId], '1000000000000000000'), TradeType.EXACT_INPUT)

        console.log(route.midPrice.toSignificant(6)) // 201.306
        console.log(route.midPrice.invert().toSignificant(6)) // 0.00496756

        console.log(trade.executionPrice.toSignificant(6))
        console.log(trade.nextMidPrice.toSignificant(6))

        const amountIn = '1000000000000000000' // 1 WETH

        const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
        const path = [WETH[targetToken.chainId].address, targetToken.address]
        const to = account // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw // // needs to be converted to e.g. hex
        const web3 = new Web3(window.ethereum);
        const nonce = await web3.eth.getTransactionCount(account, 'latest');
        const transaction = {
            to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            from: to,
            value: value.toString(16),
            gas: MAX_FEE_PER_GAS,
            gasPrice: MAX_PRIORITY_FEE_PER_GAS,
            nonce: nonce.toString(),
        }
        const res = await sendTransactionViaExtension(transaction)
        return res;
    }
    return (
        <Box sx={{ flexGrow: 1 }} className={styles.container}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop: 2,
                        p: 2,
                        backgroundColor: 'rgba(20, 17, 25, 1)',
                        borderRadius: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                paddingTop: 1,
                                fontSize: 'rem',
                                fontWeight: '700',
                                color: 'white'
                            }}
                        >
                            {"Buy $WETH with USDC"}
                        </Box>
                        <div className={styles.placeholder} data-placeholder="WETH">
                            <CssTextField
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    input: { color: 'white' }
                                }}
                                id="outlined-basic"
                                variant="outlined"
                                fullWidth
                                value={buyTargetTokenNumber}
                                onChange={changeBuyTargetTokenNumber}
                                type="number" />
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
                                display: 'flex',
                                marginTop: 1,
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'Poppins',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                            }}
                        >
                            {buyCurrencyTokenNumber} USDC
                        </Box>
                        <Button
                            sx={{ marginTop: 2, height: 60 }}
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={buyTargetToken}>Buy</Button>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop: 2,
                        p: 2,
                        backgroundColor: 'rgba(20, 17, 25, 1)',
                        borderRadius: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                paddingTop: 1,
                                fontSize: '1rem',
                                fontWeight: '700',
                                color: 'white'
                            }}
                        >
                            {"Sell $WETH with USDC"}
                        </Box>
                        <div className={styles.placeholder} data-placeholder="WETH">
                            <CssTextField
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    height: 60,
                                    input: { color: 'white' }
                                }}
                                id="outlined-basic"
                                fullWidth
                                variant="outlined"
                                value={sellTargetTokenNumber}
                                onChange={changeSellTargetTokenNumber}
                                type="number" /> </div>
                        <Box sx={{ height: 60, marginTop: 1 }}></Box>
                        <Box
                            sx={{
                                display: 'flex',
                                marginTop: 1,
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'Poppins',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                            }}
                        >
                            {sellCurrencyTokenNumber} USDC
                        </Box>
                        <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth>Sell</Button>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginTop: 2,
                        p: 2,
                        backgroundColor: 'rgba(20, 17, 25, 1)',
                        borderRadius: 2
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                paddingTop: 1,
                                fontSize: '1rem',
                                fontWeight: '700',
                                color: 'white'
                            }}
                        >
                            {"Stake $AZUKI with ETH"}
                        </Box>
                        <CssTextField
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                input: { color: 'white' }
                            }}
                            id="outlined-basic"
                            fullWidth
                            variant="outlined" />
                        <CssTextField
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                fontSize: '1rem',
                                fontWeight: '700',
                                input: { color: 'white' }
                            }}
                            id="outlined-basic"
                            fullWidth
                            variant="outlined" />
                        <Box
                            sx={{
                                display: 'flex',
                                marginTop: 1,
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'Poppins',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                            }}
                        >
                            {"33% Interest Rate"}
                        </Box>
                        <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth>Stake</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}