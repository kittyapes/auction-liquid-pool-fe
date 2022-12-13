import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Details from "../components/pool/details/Details";
import Landing from "../components/home/Landing";
import SwapList from '../components/swap/SwapList';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hypex</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SwapList></SwapList>
      <main className={styles.main}>
          <Details />
      </main>
    </div>
  )
}
