import { useEffect } from "react";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Web3ContextProvider } from "../utils/web3-context";
import Header from "../components/header/Header";
import "../styles/globals.css";

const THEME = createTheme({
  typography: {
    fontFamily: `"Poppins"`,
    fontSize: 14,
    fontWeightLight: 600,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      main: "#7924FF",
    },
    secondary: {
      main: "#1F1927",
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (newPos) => setPosition(newPos),
      console.error
    );
  }, []);

  return (
    <Web3ContextProvider>
      <ThemeProvider theme={THEME}>
        <Head>
          <title>Hypex</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </Web3ContextProvider>
  );
}
