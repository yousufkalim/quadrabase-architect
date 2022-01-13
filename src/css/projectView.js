// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  main_container: {
    position: "relative",
    overflowX: "hidden",
    height: "100vh",
  },
  container: {
    padding: "10px 20px",
    height: "100vh",
  },
  flex_container: {
    display: "flex",
    justifyContent: "space-between",
  },
  btn: {
    backgroundColor: "#3b373c !important",
    marginRight: "10px !important",
    height: "35px !important",
  },
  left_container: {
    width: "25%",
    marginTop: 20,
  },
  right_container: {
    width: "73.4%",
    marginTop: 20,
    padding: "0 20px",
  },
  fotter_text: {
    width: "70%",
    display: "flex",
    justifyContent: "flex-end",
  },
});
