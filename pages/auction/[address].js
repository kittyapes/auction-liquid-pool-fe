import styles from "../../styles/Home.module.css";
import Auction from "../../components/pool/auction/Auction";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";

export default function Home() {
  const router = useRouter();
  // NFT pool address
  const { address } = router.query;
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
        <Auction nftPoolAddress={nftPoolAddress} tokenId={tokenId} />
      </main>
    </div>
  );
}
