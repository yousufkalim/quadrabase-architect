import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress style={{ color: "#f2a17b" }} />
      <h4 style={{ marginTop: 10 }}>Please Wait, Loading Project Data!</h4>
    </Box>
  );
};

export default Loader;
