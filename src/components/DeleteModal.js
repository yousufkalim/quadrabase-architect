// init
import React from "react";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

// component
const DeleteModal = (props) => {
  const { t } = useTranslation();
  // jsx
  return (
    <div style={{ display: "grid", placeItems: "center", padding: 20 }}>
      <Typography variant="h4">{t("Are You Sure?")}</Typography>
      <Typography variant="subtitle1">
        {t("Do you really want to delete? This process cannot be undone?")}
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
          {t("Cancel")}
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
          {t("Delete")}
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
