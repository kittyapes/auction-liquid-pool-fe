import { useRouter } from "next/router";
import { Container, Logo, Left } from "./style";

const Landing = () => {
  const router = useRouter()

  const swapNFTs = async() => {
    //
  }

  const listProject = async() => {
    //
  }

  return (
    <Container>
       <h>NFT AUCTION</h>
       <p>LIQUID POOL PROTOCOL</p>
       <p>🔥Total Trading Volume: $13,355</p> <p>🔥Total Value Locked: $4,3465</p>
       <button onclick={swapNFTs}> Swap NFTs</button>
       <button onclick={listProject}> List Your Project </button>
    </Container>
  );
}

export default Landing;