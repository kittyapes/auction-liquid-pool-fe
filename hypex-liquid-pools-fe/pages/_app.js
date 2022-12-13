import "../styles/globals.css";
import Header from "../components/header/Header";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import { WalletProvider } from "../context/wallet";

function getLibrary(provider) {
  return new Web3(provider);
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <Header />
        <Component {...pageProps} />
      </WalletProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
