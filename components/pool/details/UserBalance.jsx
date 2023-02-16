import React, { useEffect, useState, useRef } from "react";
import { getProvider, getContract } from "../contract/poolContract";
import { useWalletContext } from "../../../context/wallet";
import { ethers } from "ethers";
import styles from "./style/Details.module.css";

export default function UserBanalce({ targetToken, currencyToken, refresh }) {
  if (!targetToken || !currencyToken) return;
  const provider = getProvider();
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
    fetchUserWalletTargetTokenBalance();
    fetchUserWalletCurrencyTokenBalance();
  }, [pendingTxs, refresh]);

  return (
    <div className={styles.userBalance}>
      <p> Tokens in your wallet</p>
      <div className={styles.balance}>
        <p>{`${targetToken.name} balance:`}</p> <p>{targetTokenBalance}</p>
      </div>
      <div className={styles.balance}>
        <p>{`${currencyToken.name} balance:`}</p>
        <p> {currencyTokenBalance}</p>
      </div>
    </div>
  );
}
