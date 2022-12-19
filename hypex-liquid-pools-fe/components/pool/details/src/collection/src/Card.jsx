import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../style/Collection.module.css";
const Card = ({ nft, type }) => {
  const router = useRouter();
  const useToHome = () => {
    router.push("/");
  };
  return (
    <div className={styles.card}>
      <div>
        <img className={styles.nft_image} src={nft.src} />
      </div>
      <button className={`${styles.button} ${styles.purple}`}>{type}</button>
    </div>
  );
};

export default Card;
