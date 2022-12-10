import React, { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import HypexLogo from '../../static/images/logo.png'
import { Container, Logo, Left, Right } from "./style";
import styles from '../header/style/Header.module.css';
import { useRouter } from "next/router";
var jazzicon = require('jazzicon')

const Header = () => {
  const router = useRouter();
  const {account} = useWeb3React()
  const avatarRef = useRef()
  const useToHome = () => {
    router.push('/')
  }
  useEffect(() => {
      const element = avatarRef.current;
      if (element && account) {
          const addr = account.slice(2, 10);
          const seed = parseInt(addr, 16);
          const icon = jazzicon(20, seed); //generates a size 20 icon
          if (element.firstChild) {
              element.removeChild(element.firstChild);
          }
          element.appendChild(icon);
      }
  }, [account, avatarRef]);
  const abbreviateWalletAddress = (address) => {
    return address.slice(0, 5) + '...' + address.slice(-4);
  }
  return (
    <Container>
      <Left>
        <div className={styles.logo} onClick={useToHome}>
          <img src={HypexLogo.src} alt="hypex-logo" />
        </div>
      </Left>
      <Right>
        <div ref={avatarRef}></div>
        <span>{abbreviateWalletAddress(account)}</span>
      </Right>
    </Container>
  );
}

export default Header;