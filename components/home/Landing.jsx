import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from '../home/style/Landing.module.css'
import { useWeb3React } from "@web3-react/core";
import { injected } from "../Wallet/connectors";
import { useWalletContext } from "../../context/wallet";
import { useChainId } from "../../api/contract";
import { Button } from '@mui/material';

const Landing = () => {
  const CHAIN_ID = "5";
  const router = useRouter();
  const { active, account, activate } = useWeb3React();
  const [chainId, setChainId] = useState(null);
  const {
    setWalletAddress,
  } = useWalletContext()

  useEffect(() => {
    async function fetchData() {
      try {
        if (window.ethereum) {
          const tempChainId = await useChainId();
          console.log(`tempChainId: ${tempChainId}`);
          if (tempChainId == CHAIN_ID) {
            setChainId(tempChainId);
          } else {
            alert("Please select correct Ethereum in your wallet");
          }
        } else {
          // alert("Cannot detect crypto wallet"); 
        }
      } catch (error) {
        console.log(error)
        alert("Oops, something wrong with our site!");
      }
    }
    fetchData();
    setWalletAddress(account);
  }, [account]);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') != true) {
        try {
          await activate(injected);
          localStorage.setItem('isWalletConnected', true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  const swapNFTs = async () => {
    console.log(active)
    if (active) {
      // navigate to swap page.
      router.push('/swap');
    } else {
      // remind user to connect wallet.
      await activate(injected);
    }
    console.log('swapNFTs');
  }

  const listProject = async () => {
    if (active) {
      // navigate to list project page.
      router.push('/list_project');
    } else {
      // remind user to connect wallet.
      await activate(injected);
    }
    console.log('listProject');
  }
  return (
    <div className={styles.content}>
      <h className={styles.title}>NFT AUCTION</h>
      <p className={styles.subtitle}>LIQUID POOL PROTOCOL</p>
      <div className={styles.subcontent}>
        <div className={styles.data}><p>🔥Total Trading Volume: $13,355</p></div>
        <div className={styles.data}><p>🔥Total Value Locked: $4,3465</p></div>
      </div>
      <Button className={`${styles.button} ${styles.purple}`} sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" onClick={swapNFTs}>Swap NFTs</Button>
      <Button className={`${styles.button} ${styles.purple}`} sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" onClick={listProject}>List Your Project</Button>
    </div>
  );
}

export default Landing;