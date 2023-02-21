import React from "react";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Button, Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import Collection from "../collection/Collection";
import styles from "../user_actions/style/UserActions.module.css";

const TradeToken = dynamic(() => import("../trade/TradeToken"), { ssr: false });

const TabPanel = (props) => {
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
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

export default function UserActions({
  nftPoolAddress,
  name,
  targetToken,
  currencyToken,
  setErrorMsg,
  setSuccessMsg,
  refresh,
}) {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const randomRedeem = () => {
    router.push(`/redeem/${nftPoolAddress}`);
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
          <Tab label={`Trade $${name}`} {...a11yProps(0)} />
          <Tab label="Buy NFTs" {...a11yProps(1)} />
          <Tab label={`Your ${name}`} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TradeToken
          targetToken={targetToken}
          currencyToken={currencyToken}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
          refresh={refresh}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Collection nftPoolAddress={nftPoolAddress} type="Auction" />
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
          {/* <input className={styles.redeemInput} value={1} type='number' /> */}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Collection nftPoolAddress={nftPoolAddress} type="Swap" />
      </TabPanel>
    </Box>
  );
}
