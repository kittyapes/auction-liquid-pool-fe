import React, { useEffect, useState, useRef } from "react";
import styles from "./style/Collection.module.css";
import Grid from "@mui/material/Grid";
import Card from "./src/Card";
import { useRouter } from "next/router";

const Collection = ({ pool, nfts, type }) => {
  const router = useRouter();
  const useToHome = () => {
    router.push("/");
  };
  return (
    <Grid container className={styles.collection}>
      {nfts.map((nft) => {
        return <Card pool={pool} nft={nft} key={nft.address} type={type} item={true} />;
      })}
    </Grid>
  );
};

export default Collection;
