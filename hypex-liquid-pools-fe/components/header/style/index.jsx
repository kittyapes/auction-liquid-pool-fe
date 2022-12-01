import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 96px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;


  .left-part,
  .right-part {
    display: flex;
    align-items: center;
    color: #fff;
  }

  .left-part {
    margin-left: 5%;
    // padding-left: 50px;
    @media (max-width: 768px) {
      margin-left: 3%;
      padding-left: 0;
    }

    .link {
      margin-left: 30px;
      cursor: pointer;
      font-family: 'Futura';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 27px;
      color: #FFFFFF;

      :hover {
        color: #AB41FF;
      }
    }
  }

  .right-part {
    margin-right: 8%;

    div {
      margin-left: 30px;
      cursor: pointer
    }

    .logout {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      padding-right: 10%;
    }
  }
`;

export const BurgerStyles = {
  bmBurgerButton: {
    position: 'fixed',
    width: '36px',
    height: '30px',
    right: '20px',
    top: '20px'
  },
  bmBurgerBars: {
    background: "white"
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: 'white',
    padding: '0.8em'
  },
  bmItem: {
    display: 'flex',
    fontSize: '30px',
    color: 'white'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
};

export const BigLetter = styled.span`
  font-size: 40px;
  @media (max-width: 768px) {
    font-size: 20px;
  };
`;

export const Left = styled.div`
  margin-left: 5%;
`
export const Logo = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-family: PROXIMA, sans-serif;
  font-weight: bold;
  font-size: 30px;
  letter-spacing: 1px;

  img {
    height: auto;
    width: 128px;
  }

  .logo-text {
    margin-left: 10px;
  }

  .x-letter {
    color: #AB41FF
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 376px) {
    font-size: 15px;
  }
`;