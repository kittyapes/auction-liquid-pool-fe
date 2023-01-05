import React, { useEffect, useState, useRef } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import styles from "./style/Trade.module.css";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { withStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { Pool } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'


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
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/8d5bc85320a64c5ca0e25c4ce8d8120e')
    const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)

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
        async function test() {
            const [immutables, state] = await Promise.all([getPoolImmutables(), getPoolState()])

            const TokenA = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')

            const TokenB = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')
            const poolExample = new Pool(
                TokenA,
                TokenB,
                immutables.fee,
                state.sqrtPriceX96.toString(),
                state.liquidity.toString(),
                state.tick
            )
            console.log(poolExample);
        }
        test();
    }, []);

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
                            {"Buy $AZUKI with ETH"}
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
                            {"0.44"}
                        </Box>
                        <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" fullWidth>Buy</Button>
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