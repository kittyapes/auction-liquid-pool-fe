import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import RandomSwap from "../../components/pool/random_swap/RandomSwap";
import styles from "../../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [nftPoolAddress, setNFTPoolAddress] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  useEffect(() => {
    if (router.isReady) {
      setNFTPoolAddress(router.query.address);
      setTokenId(router.query.id);
    }
  }, [router.isReady]);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <RandomSwap nftPoolAddress={nftPoolAddress} tokenId={tokenId} />
      </main>
    </div>
  );
}
