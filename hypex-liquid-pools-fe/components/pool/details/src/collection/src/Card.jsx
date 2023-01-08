import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../style/Collection.module.css";
import { Button, Box, Divider } from '@mui/material';

const Card = ({ nft, type, pool }) => {
  const router = useRouter();
  const auction = () => {
    router.push(`/${type.toLowerCase()}/${pool.address}?id=${nft.tokenId}`);
  };
  return (
    <div className={styles.card}>
      <div>
        <img className={styles.nft_image} src={nft.src} />
      </div>
      <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" className={`${styles.button} ${styles.purple}`} onClick={auction}>{type}</Button>
    </div>
  );
};

export default Card;
