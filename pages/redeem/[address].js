import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Redeem from "../../components/pool/redeem/Redeem";
import styles from "../../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  // Nft pool address
  const [nftPoolAddress, setNFTPoolAddress] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      setNFTPoolAddress(router.query.address);
    }
  }, [router.isReady]);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Redeem nftPoolAddress={nftPoolAddress} />
      </main>
    </div>
  );
}
