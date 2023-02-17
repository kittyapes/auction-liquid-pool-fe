import React, { useEffect, useState, useRef } from "react";
import { getProvider, getContract } from "../contract/poolContract";
import { useWalletContext } from "../../../context/wallet";
import { ethers } from "ethers";
import styles from "./style/Details.module.css";
import Skeleton from "@mui/material/Skeleton";

export default function UserBanalce({ targetToken, currencyToken, refresh }) {
  if (!targetToken || !currencyToken) return;
  const provider = getProvider();
  const [loading, setLoading] = useState(true);
  const { account, pendingTxs, setPendingTxs } = useWalletContext();
  const [targetTokenBalance, setTargetTokenBalance] = useState(0);
  const [currencyTokenBalance, setCurrencyTokenBalance] = useState(0);
  const formatFloatNumber = (x) => Number.parseFloat(x).toFixed(3);
  async function fetchUserWalletTargetTokenBalance() {
    const tokenContract = getContract(targetToken.address);
    const balance = await tokenContract.balanceOf(account);
    setTargetTokenBalance(formatFloatNumber(ethers.utils.formatUnits(balance)));
  }
  async function fetchUserWalletCurrencyTokenBalance() {
    const tokenContract = getContract(currencyToken.address);
    const balance = await tokenContract.balanceOf(account);
    setCurrencyTokenBalance(
      formatFloatNumber(ethers.utils.formatUnits(balance))
    );
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUserWalletTargetTokenBalance(),
      fetchUserWalletCurrencyTokenBalance(),
    ]).then((_) => {
      setLoading(false);
    });
  }, [pendingTxs, refresh]);

  return (
    <div className={styles.userBalance}>
      <p> Tokens in your wallet:</p>
      <div className={styles.balance}>
        <div style={{ display: "flex", margin: "10px" }}>
          <span
            style={{ marginRight: "8px" }}
          >{`${targetToken.name} balance:`}</span>
          {loading ? (
            <Skeleton
              variant="text"
              sx={{
                display: "flex",
                bgcolor: "white",
                width: "40px",
              }}
            />
          ) : (
            targetTokenBalance
          )}
        </div>
      </div>
      <div className={styles.balance}>
        <div style={{ display: "flex", marginTop: "4px", margin: "10px" }}>
          <span
            style={{ marginRight: "8px" }}
          >{`${currencyToken.name} balance:`}</span>
          {loading ? (
            <Skeleton
              variant="text"
              sx={{
                display: "flex",
                bgcolor: "white",
                width: "40px",
              }}
            />
          ) : (
            currencyTokenBalance
          )}
        </div>
      </div>
    </div>
  );
}
