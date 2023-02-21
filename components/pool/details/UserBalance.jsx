import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { utils } from "ethers";
import { useWeb3Context } from "../../../utils/web3-context";
import styles from "./style/Details.module.css";

const UserBalance = ({ targetToken, currencyToken, refresh }) => {
  if (!targetToken || !currencyToken) return;

  const { account, provider, pendingTxs, setPendingTxs } = useWeb3Context();
  const [loading, setLoading] = useState(true);
  const [targetTokenBalance, setTargetTokenBalance] = useState(0);
  const [currencyTokenBalance, setCurrencyTokenBalance] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUserWalletTargetTokenBalance(),
      fetchUserWalletCurrencyTokenBalance(),
    ]).then((_) => {
      setLoading(false);
    });
  }, [refresh]);

  const formatFloatNumber = (x) => Number.parseFloat(x).toFixed(3);

  const fetchUserWalletTargetTokenBalance = async () => {
    const tokenContract = getContract(targetToken.address);
    const balance = await tokenContract.balanceOf(account);
    setTargetTokenBalance(formatFloatNumber(utils.formatUnits(balance)));
  };

  const fetchUserWalletCurrencyTokenBalance = async () => {
    const tokenContract = getContract(currencyToken.address);
    const balance = await tokenContract.balanceOf(account);
    setCurrencyTokenBalance(formatFloatNumber(utils.formatUnits(balance)));
  };

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
};

export default UserBalance;
