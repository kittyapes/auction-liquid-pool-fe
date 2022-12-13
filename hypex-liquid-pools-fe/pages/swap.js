import Head from "next/head";
import styles from "../styles/Home.module.css";
import SwapList from "../components/swap/SwapList";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hypex</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <SwapList />
      </main>
    </div>
  );
}
