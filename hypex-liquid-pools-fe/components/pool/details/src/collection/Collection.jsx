import React, { useEffect, useState, useRef } from "react";
import styles from "./style/Collection.module.css";
import Grid from "@mui/material/Grid";
import Card from "./src/Card";
import { useRouter } from "next/router";

const Collection = ({ nfts, type }) => {
  const router = useRouter();
  const useToHome = () => {
    router.push("/");
  };
  return (
    <Grid container className={styles.collection}>
      {nfts.map((nft) => {
        return <Card nft={nft} type={type} />;
      })}
    </Grid>
  );
};

export default Collection;
