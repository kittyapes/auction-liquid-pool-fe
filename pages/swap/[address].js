import styles from "../../styles/Home.module.css";
import RandomSwap from "../../components/pool/random_swap/RandomSwap";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  // NFT Pool address
  const { address } = router.query;
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <RandomSwap address={address} />
      </main>
    </div>
  );
}
