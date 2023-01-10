import React, { useEffect, useState, useRef } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import styles from "./style/Trade.module.css";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { Pool, Route } from '@uniswap/v3-sdk';
import { Trade as UniTrade } from "@uniswap/v3-sdk";
import { ethers, BigNumber } from 'ethers';
import { CurrencyAmount, Token, TradeType, Percent } from '@uniswap/sdk-core'
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router'
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import JSBI from 'jsbi';

import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
function fromReadableAmount(amount, decimals) {
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
        JSBI.multiply(
            JSBI.BigInt(adjustedAmount),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
        ),
        JSBI.BigInt(extraDigits)
    )
}
function countDecimals(x) {
    if (Math.floor(x) === x) {
        return 0
    }
    return x.toString().split('.')[1].length || 0
}
const CssTextField = withStyles({
    root: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3);',
                borderWidth: '2px'
            }
        },
    },
})(TextField);

class Price {
    constructor(
        baseToken,
        quoteToken,
        denominator,
        numerator) {
        this.baseToken = baseToken;
        this.quoteToken = quoteToken;
        this.denominator = denominator;
        this.numerator = numerator;
    }
}

class Immutables {
    constructor(factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick) {
        this.factory = factory;
        this.token0 = token0;
        this.token1 = token1;
        this.fee = fee;
        this.tickSpacing = tickSpacing;
        this.maxLiquidityPerTick = maxLiquidityPerTick;
    }
}

class State {
    constructor(liquidity, slot) {
        this.liquidity = liquidity;
        this.sqrtPriceX96 = slot[0];
        this.tick = slot[1];
        this.observationIndex = slot[2];
        this.observationCardinality = slot[3];
        this.observationCardinalityNext = slot[4];
        this.feeProtocol = slot[5];
        this.unlocked = slot[6];
    }
}


export default function Trade() {
    const browserExtensionProvider = createBrowserExtensionProvider()
    const { account } = useWeb3React();
    const [buyTargetTokenNumber, setBuyTargetTokenNumber] = useState(0);
    const [buyCurrencyTokenNumber, setBuyCurrencyTokenNumber] = useState(0);
    const [targetToCurrencyRatio, setTargetToCurrencyRatio] = useState(-1);
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/8d5bc85320a64c5ca0e25c4ce8d8120e')
    /// Pool(target token / ETH) should be created first.
    /// current pool (USDC / WETH)
    const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'
    // https://github.com/Uniswap/v3-periphery/blob/main/deploys.md
    const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)
    const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, provider)
    const router = new AlphaRouter({ chainId: 1, provider: provider })
    const changeBuyTargetTokenNumber = (event) => {
        setBuyTargetTokenNumber(event.target.value);
    }

    useEffect(() => {
        setBuyCurrencyTokenNumber(buyTargetTokenNumber * targetToCurrencyRatio);
    }, [buyTargetTokenNumber, targetToCurrencyRatio])

    async function getPoolImmutables() {
        const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
            poolContract.factory(),
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.maxLiquidityPerTick(),
        ]);
        return new Immutables(factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick);
    }

    async function getPoolState() {
        const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

        const PoolState = new State(liquidity, slot);

        return PoolState
    }


    useEffect(() => {
        async function fetchTargetTokenPrice() {
            const [immutables, state] = await Promise.all([getPoolImmutables(), getPoolState()])
            const currencyToken = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')
            const targetToken = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')
            const poolExample = new Pool(
                currencyToken,
                targetToken,
                immutables.fee,
                state.sqrtPriceX96.toString(),
                state.liquidity.toString(),
                state.tick
            )
            const targetTokenOverCurrency = poolExample.token1Price
            console.log(targetTokenOverCurrency.toSignificant(6));
            setTargetToCurrencyRatio(targetTokenOverCurrency.toSignificant(6));
        }
        fetchTargetTokenPrice();
    }, []);

    const startBuy = async () => {
        // query the state and immutable variables of the pool
        const [immutables, state] = await Promise.all([getPoolImmutables(), getPoolState()])

        // create instances of the Token object to represent the two tokens in the given pool
        const TokenA = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')

        const TokenB = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')

        // create an instance of the pool object for the given pool
        const poolExample = new Pool(
            TokenA,
            TokenB,
            immutables.fee,
            state.sqrtPriceX96.toString(), //note the description discrepancy - sqrtPriceX96 and sqrtRatioX96 are interchangable values
            state.liquidity.toString(),
            state.tick
        )

        // assign an input amount for the swap
        // 1000 USDC
        const amountIn = 1000

        // call the quoter contract to determine the amount out of a swap, given an amount in
        const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
            immutables.token0,
            immutables.token1,
            immutables.fee,
            amountIn.toString(),
            0
        )

        // create an instance of the route object in order to construct a trade object
        const swapRoute = new Route([poolExample], TokenA, TokenB)

        // create an unchecked trade instance
        const uncheckedTradeExample = await UniTrade.createUncheckedTrade({
            route: swapRoute,
            inputAmount: CurrencyAmount.fromRawAmount(TokenA, amountIn.toString()),
            outputAmount: CurrencyAmount.fromRawAmount(TokenB, quotedAmountOut.toString()),
            tradeType: TradeType.EXACT_INPUT,
        })

        // print the quote and the unchecked trade instance in the console
        console.log('The quoted amount out is', quotedAmountOut.toString())
        console.log('The unchecked trade object is', uncheckedTradeExample)

    }

    const tradeFunc = async () => {

        const WETH = new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether')

        const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
        const MY_ADDRESS = account;
        const options = {
            recipient: MY_ADDRESS,
            slippageTolerance: new Percent(5, 100),
            deadline: Math.floor(Date.now() / 1000 + 1800),
            type: SwapType.SWAP_ROUTER_02,
        }
        const route = await router.route(
            CurrencyAmount.fromRawAmount(
                WETH,
                fromReadableAmount(
                    1, // 1 weth
                    WETH.decimals
                ).toString()
            ),
            USDC,
            TradeType.EXACT_INPUT,
            options
        )
        const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
        const tokenContract = new ethers.Contract(
            WETH.address,
            ERC20_ABI,
            browserExtensionProvider
        )
        const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000;
        const MAX_FEE_PER_GAS = '100000000000'
        const MAX_PRIORITY_FEE_PER_GAS = '100000000000'
        const transaction = await tokenContract.populateTransaction.approve(
            V3_SWAP_ROUTER_ADDRESS,
            fromReadableAmount(
                TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                WETH.decimals
            ).toString()
        )


        // Check the pool first.
        // const tokenApproval = await sendTransactionViaExtension(browserExtensionProvider, {
        //     ...transaction,
        //     from: account
        // });
        // if (tokenApproval !== TransactionState.Sent) {
        //     // TransactionState.Failed
        // }

        const res = await sendTransactionViaExtension(browserExtensionProvider, {
            data: route.methodParameters?.calldata,
            to: V3_SWAP_ROUTER_ADDRESS,
            value: route?.methodParameters?.value,
            from: MY_ADDRESS,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        })
        console.log(res);
        return res

    }
    useEffect(() => {
        tradeFunc();
    }, [])
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
                                fontSize: '1rem',
                                fontWeight: '700',
                            }}
                        >
                            {"Buy $WETH with USDC"}
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
                            variant="outlined"
                            value={buyTargetTokenNumber}
                            onChange={changeBuyTargetTokenNumber}
                            type="number" />
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
                            onClick={startBuy}>Buy</Button>
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
                            }}
                        >
                            {"Sell $AZUKI with ETH"}
                        </Box>
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
                            variant="outlined" />
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
                            {"$0.44"}
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

const ERC20_ABI = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',

    // Authenticated Functions
    'function transfer(address to, uint amount) returns (bool)',
    'function approve(address _spender, uint256 _value) returns (bool)',

    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
]

function createBrowserExtensionProvider() {
    try {
        return new ethers.providers.Web3Provider(window.ethereum, 'any')
    } catch (e) {
        console.log('No Wallet Extension Found')
        return null
    }
}

// Transacting with a wallet extension via a Web3 Provider
async function sendTransactionViaExtension(browserExtensionProvider, transaction) {
    try {
        console.log(browserExtensionProvider.send);
        console.log(transaction);
        const receipt = await browserExtensionProvider?.send(
            'eth_sendTransaction',
            [transaction]
        )
        if (receipt) {
            return TransactionState.Sent
        } else {
            return TransactionState.Failed
        }
    } catch (e) {
        console.log(e)
        return TransactionState.Rejected
    }
}

const TransactionState = {
    Failed: 'Failed',
    New: 'New',
    Rejectet: 'Rejected',
    Sending: 'Sending',
    Sent: 'Sent',
}