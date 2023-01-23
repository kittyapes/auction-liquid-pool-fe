import styles from "../../styles/Home.module.css";
import Details from "../../components/pool/details/Details";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { address } = router.query;
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Details address={address} />
      </main>
    </div>
  );
}
