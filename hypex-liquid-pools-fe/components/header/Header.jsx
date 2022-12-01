import HypexLogo from '../../static/images/logo.png'
import { Container, Logo, Left } from "./style";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter()
  const useToHome = () => {
    router.push('/')
  }

  return (
    <Container>
      <Left>
        <Logo onClick={useToHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </Logo>
      </Left>
    </Container>
  );
}

export default Header;