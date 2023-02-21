import styles from "../styles/Home.module.css";
import SwapList from "../components/swap/SwapList";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <SwapList />
      </main>
    </div>
  );
}
