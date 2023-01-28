import PropTypes from "prop-types";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Button, Box, Divider } from "@mui/material";
import styles from "../user_actions/style/UserActions.module.css";
import Collection from "../collection/Collection";
import Azuki from "../../../../../static/images/azuki.jpeg";
import dynamic from "next/dynamic";
import { API, getTokenIds } from "../../../contract/poolContract";
const TradeToken = dynamic(() => import("../trade/TradeToken"), { ssr: false });

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className={styles.tab_panel}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getNTFs = async () => {
  getTokenIds().then((e) => {
    nfts = [];
    e.map((item) => {
      nfts.push({
        tokenId: item,
      });
    });
  });
};
export default function UserActions({ pool, setErrorMsg }) {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  useEffect(() => {
    getNTFs();
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const randomRedeem = () => {
    router.push(`/redeem/${pool.address}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          textColor="inherit"
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label={`Trade $${pool.name}`} {...a11yProps(0)} />
          <Tab label="Buy NFTs" {...a11yProps(1)} />
          <Tab label={`Your ${pool.name}`} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TradeToken setErrorMsg={setErrorMsg} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Collection pool={pool} nfts={nfts} type={"Auction"} />
        <Divider className={styles.divider} variant="middle" />
        <div className={styles.redeem}>
          <Button
            sx={{ marginTop: 2, height: 60 }}
            variant="contained"
            size="large"
            className={styles.button}
            onClick={randomRedeem}
          >
            Random Redeem
          </Button>
          <input className={styles.redeemInput} value={1} type="number" />
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Collection pool={pool} nfts={nfts} type={"Swap"} />
      </TabPanel>
    </Box>
  );
}

let nfts = [];
