import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Identicon from "./IdentIcon";
import styles from "../header/style/Header.module.css";
import { useWalletContext } from "../../context/wallet";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
const style = {
  position: "absolute",
  top: 96,
  right: 0,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 4,
};

export default function AccountModal({ setAccountModalOpen }) {
  const handleOpen = () => setAccountModalOpen(true);
  const handleClose = () => setAccountModalOpen(false);
  const { account } = useWalletContext();
  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Identicon />
            <p className={styles.accountAddress}>
              {account.slice(0, 5) + "..." + account.slice(-4)}
            </p>
            <Button size="small">
              <ContentCopyIcon />
            </Button>
            <Button size="small">
              <HighlightOffIcon />
            </Button>
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ETH Balance
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
