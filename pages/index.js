import Landing from "../components/home/Landing";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Landing />
      </main>
    </div>
  );
}
