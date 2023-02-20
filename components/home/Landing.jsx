import React from "react";
import { useRouter } from "next/router";
import styles from "../home/style/Landing.module.css";
import { Button } from "@mui/material";

const Landing = () => {
  const CHAIN_ID = "5";
  const router = useRouter();
  const swapNFTs = async () => {
    router.push("/swap");
    console.log("swapNFTs");
  };

  const listProject = async () => {
    router.push("/list_project");
    console.log("listProject");
  };
  return (
    <div className={styles.content}>
      <h className={styles.title}>NFT AUCTION</h>
      <p className={styles.subtitle}>LIQUID POOL PROTOCOL</p>
      <div className={styles.subcontent}>
        <div className={styles.data}>
          <p>🔥Total Trading Volume: $13,355</p>
        </div>
        <div className={styles.data}>
          <p>🔥Total Value Locked: $4,3465</p>
        </div>
      </div>
      <Button
        className={`${styles.button} ${styles.purple}`}
        sx={{ marginTop: 2, height: 60 }}
        variant="contained"
        size="large"
        onClick={swapNFTs}
      >
        Swap NFTs
      </Button>
      <Button
        className={`${styles.button} ${styles.purple}`}
        sx={{ marginTop: 2, height: 60 }}
        variant="contained"
        size="large"
        onClick={listProject}
      >
        List Your Project
      </Button>
    </div>
  );
};

export default Landing;
