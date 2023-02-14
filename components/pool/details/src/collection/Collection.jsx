import React, { useEffect, useState, useRef } from "react";
import styles from "./style/Collection.module.css";
import Grid from "@mui/material/Grid";
import Card from "./src/Card";
import { useRouter } from "next/router";
import { fetchNFTTokenIdsFromPoolAddress } from "../../../contract/poolContract";
const Collection = ({ pool, type }) => {
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    async function fetch() {
      const tokenIds = await fetchNFTTokenIdsFromPoolAddress(pool.address);
      let tempList = [];
      tokenIds.forEach((id) => {
        tempList.push({
          tokenId: id,
        });
      });
      setNfts(tempList);
      console.log(tempList);
    }
    fetch();
  }, []);
  return (
    <Grid container className={styles.collection}>
      {nfts.length === 0 ? (
        <div className={styles.placeholder}></div>
      ) : (
        <div></div>
      )}
      {nfts.map((nft) => {
        return (
          <Card
            pool={pool}
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
