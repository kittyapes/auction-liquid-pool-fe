import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import Card from "./src/Card";
import styles from "./style/Collection.module.css";
import { usePool } from "../../../../../utils/contracts/pool-slice";

const Collection = ({ nftPoolAddress, type }) => {
  const { data: pool } = usePool(nftPoolAddress);
  const tokenIds = useMemo(() => (pool ? pool.tokenIds : []), [pool]);
  const allMyNFTs = []; // TODO: fetch all my nfts

  return (
    <Grid container className={styles.collection}>
      {(type == "Auction" ? tokenIds : allMyNFTs) === null ? (
        <div className={styles.placeholder}></div>
      ) : (
        ""
      )}
      {(type == "Auction" ? tokenIds ?? [] : allMyNFTs ?? []).map(
        (tokenId, index) => (
          <Card
            key={`${index}`}
            nftPoolAddress={nftPoolAddress}
            type={type}
            src={""}
            tokenId={tokenId}
          />
        )
      )}
      {type == "Auction"
        ? tokenIds.length == 0 && <p className={styles.banner}>Empty</p>
        : allMyNFTs.length == 0 && <p className={styles.banner}>Empty</p>}
    </Grid>
  );
};

export default Collection;
