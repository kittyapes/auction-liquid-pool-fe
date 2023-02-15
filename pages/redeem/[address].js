import styles from "../../styles/Home.module.css";
import Redeem from "../../components/pool/redeem/Redeem";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  // Nft pool address
  const { address } = router.query;
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Redeem address={address} />
      </main>
    </div>
  );
}
