import { useRouter } from "next/router";
import styled from "styled-components";
import styles from '../home/style/Landing.module.css'
import { Container, Logo, Left } from "./style";

const Landing = () => {
  const router = useRouter()

  const swapNFTs = async() => {
    //
  }

  const listProject = async() => {
    //
  }
  return (
    <div className={styles.content}>
       <h className={styles.title}>NFT AUCTION</h>
       <p className={styles.subtitle}>LIQUID POOL PROTOCOL</p>
       <div className={styles.subcontent}>
         <div className={styles.data}><p>🔥Total Trading Volume: $13,355</p></div>
         <div className={styles.data}><p>🔥Total Value Locked: $4,3465</p></div>
       </div>
       <button className={`${styles.button} ${styles.purple}`} onclick={swapNFTs}> Swap NFTs</button>
       <button className={styles.button} onclick={listProject}> List Your Project </button>
    </div>
  );
}

export default Landing;