import HypexLogo from '../../static/images/logo.png'
import { Container, Logo, Left } from "./style";
import styles from '../header/style/Header.module.css';
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const useToHome = () => {
    router.push('/')
  }

  return (
    <Container>
      <Left>
        <div className={styles.logo} onClick={useToHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </div>
      </Left>
    </Container>
  );
}

export default Header;