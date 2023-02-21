import React from "react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import styles from "../home/style/Landing.module.css";

const Landing = () => {
  const router = useRouter();

  const goSwapNFTs = () => router.push("/swap");

  const goListProject = () => router.push("/list_project");

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
        onClick={goSwapNFTs}
      >
        Swap NFTs
      </Button>
      <Button
        className={`${styles.button} ${styles.purple}`}
        sx={{ marginTop: 2, height: 60 }}
        variant="contained"
        size="large"
        onClick={goListProject}
      >
        List Your Project
      </Button>
    </div>
  );
};

export default Landing;
