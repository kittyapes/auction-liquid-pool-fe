import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Details from "../components/pool/details/Details";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Details />
      </main>
    </div>
  );
}
