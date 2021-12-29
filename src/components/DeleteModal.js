// init
import React from "react";
import { Typography, Button } from "@mui/material";

// component
const DeleteModal = (props) => {
  // jsx
  return (
    <div style={{ display: "grid", placeItems: "center", padding: 20 }}>
      <Typography variant="h4">Are You Sure?</Typography>
      <Typography variant="subtitle1">
        Do you really want to delete? This process cannot be undone?
      </Typography>
      <br />
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            marginRight: 20,
            backgroundColor: "lightgray",
          }}
          onClick={props.handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{
            marginRight: 20,
            backgroundColor: "#3b373c",
          }}
          onClick={props.handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
