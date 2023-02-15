import React, { useEffect, useState, useRef } from "react";
import styles from "./style/Collection.module.css";
import Grid from "@mui/material/Grid";
import Card from "./src/Card";
import { useRouter } from "next/router";
import { fetchNFTTokenIdsFromPoolAddress } from "../../../contract/poolContract";

const Collection = ({ nftPoolInfo, type }) => {
  const [nfts, setNfts] = useState([]);
  const [ownedNfts, setOwnedNfts] = useState([]);

  useEffect(() => {
    async function fetchNFTInfos() {
      const tokenIds = await fetchNFTTokenIdsFromPoolAddress(
        nftPoolInfo.address
      );
      let tempList = [];
      tokenIds.forEach((id) => {
        tempList.push({
          tokenId: id,
        });
      });
      setNfts(tempList);
      console.log(tempList);
    }

    async function fetchMyNfts() {
      // TODO(Peter): fetch all nfts that under my wallet in this nft pool. I didn't
      // see function like tokensOfOwner.
    }
    if (type == "Auction") {
      fetchNFTInfos();
    } else if (type == "Swap") {
      fetchMyNfts();
    }
  }, []);
  return (
    <Grid container className={styles.collection}>
      {nfts.length === 0 ? (
        <div className={styles.placeholder}></div>
      ) : (
        <div></div>
      )}
      {(type == "Auction" ? nfts : ownedNfts).map((nft) => {
        return (
          <Card
            pool={nftPoolInfo}
            nft={nft}
            key={nft.address}
            type={type}
            item={true}
          />
        );
      })}
    </Grid>
  );
};

export default Collection;
