import styles from "./style/SwapList.module.css";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import clonex from "../../static/images/clonex.jpg";
import eth from "../../static/images/eth.png";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } from '@uniswap/sdk'
import { createBrowserExtensionProvider, sendTransactionViaExtension, MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, V3_SWAP_ROUTER_ADDRESS } from "../pool/contract/poolContract";

import Web3 from "web3";
const TableCell = withStyles({
  root: {
    borderBottom: "2px solid rgba(31, 25, 39, 1);",
    backgroundColor: "rgba(255, 255, 255, 0.09)",
    color: "white",
  },
})(MuiTableCell);

const HeaderCell = withStyles({
  root: {
    borderBottom: "2px solid rgba(31, 25, 39, 1);",
    color: "rgba(255, 255, 255, 0.5);",
    backgroundColor: "rgba(31, 25, 39, 1)",
  },
})(MuiTableCell);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: "rgba(255, 255, 255, 0.09)",
  },
}));

const rows = [
  {
    id: 1,
    name: {
      name: "Clone-X",
      avatar: clonex.src,
    },
    token: "1083",
    floorPrice: {
      price: "6.99",
      coinImage: eth.src,
    },
    dayChange: -0.007,
    offerTVL: {
      price: "6.99",
      coinImage: eth.src,
    },
    address: "0x342153215aabdc432143",
  },
  {
    id: 2,
    name: {
      name: "Clone-X",
      avatar: clonex.src,
    },
    token: "1083",
    floorPrice: {
      price: "6.99",
      coinImage: eth.src,
    },
    dayChange: -0.0003,
    offerTVL: {
      price: "6.99",
      coinImage: eth.src,
    },
    address: "0x342153215aabdc432143",
  },
  {
    id: 3,
    name: {
      name: "Clone-X",
      avatar: clonex.src,
    },
    token: "1083",
    floorPrice: {
      price: "6.99",
      coinImage: eth.src,
    },
    dayChange: 0.0003,
    offerTVL: {
      price: "6.99",
      coinImage: eth.src,
    },
    address: "0x342153215aabdc432143",
  },
];

export default function SwapList() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Paper>
        <Table sx={{ background: "rgba(31, 25, 39, 1)" }}>
          <TableHead>
            <TableRow>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell align="left">Tokens</HeaderCell>
              <HeaderCell align="left">Floor Price</HeaderCell>
              <HeaderCell align="left">24h Change</HeaderCell>
              <HeaderCell align="left">Offer TVL</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.id}
                onClick={() => router.push(`/details/${row.address}`)}
              >
                <TableCell component="th" scope="row">
                  <Avatar
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                    src={row.name.avatar}
                  ></Avatar>
                  <span
                    style={{
                      marginLeft: "10px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  >
                    {row.name.name}
                  </span>
                </TableCell>
                <TableCell align="left">{row.token}</TableCell>
                <TableCell align="left">
                  <Avatar
                    style={{
                      width: "25px",
                      height: "25px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                    src={row.floorPrice.coinImage}
                  ></Avatar>
                  <span
                    style={{
                      marginLeft: "10px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  >
                    {row.floorPrice.price}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <span
                    className={row.dayChange > 0 ? styles.green : styles.red}
                  >
                    {(row.dayChange * 100).toFixed(2) + "%"}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <Avatar
                    style={{
                      width: "25px",
                      height: "25px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                    src={row.offerTVL.coinImage}
                  ></Avatar>
                  <span
                    style={{
                      marginLeft: "10px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  >
                    {row.offerTVL.price}
                  </span>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Stack spacing={2}>
        <Pagination className={styles.pagination} count={5} sx={{ button: { color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' } }} variant="outlined" shape="rounded" color='primary' />
      </Stack>
    </div>
  );
}
