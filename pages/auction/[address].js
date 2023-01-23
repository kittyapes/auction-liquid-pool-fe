import styles from "../../styles/Home.module.css";
import Auction from "../../components/pool/auction/Auction";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { address } = router.query;
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Auction address={address} />
      </main>
    </div>
  );
}
