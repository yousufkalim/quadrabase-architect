import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function BasicModal(props) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "12px",
    outlineColor: "#fff",
    outline: "none",
    boxShadow: 24,
    p: 2,
  };
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={style}>
        <div>
          <h2>
            {props.translate ? props.translate(`${props.title}`) : props.title}
          </h2>
        </div>
        {props.component}
      </Box>
    </Modal>
  );
}
