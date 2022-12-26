import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../style/Collection.module.css";
import { Button, Box, Divider } from '@mui/material';

const Card = ({ nft, type }) => {
  const router = useRouter();
  const auction = () => {
    router.push(`/auction/${nft.address}`);
  };
  return (
    <div className={styles.card}>
      <div>
        <img className={styles.nft_image} src={nft.src} />
      </div>
      <Button sx={{ marginTop: 2, height: 60 }} variant="contained" size="large" className={styles.button} onClick={auction}>{type}</Button>
    </div>
  );
};

export default Card;
