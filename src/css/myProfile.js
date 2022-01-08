// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  left_container: {
    width: "30%",
    boxShadow:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    padding: 125,
    marginTop: 10,
    display: "grid",
    placeItems: "center",
    backgroundColor: "white",
  },
  right_container: {
    width: "50%",
    boxShadow:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    padding: 25,
    marginTop: 10,
    backgroundColor: "white",
  },
  btn: {
    backgroundColor: "#3b373c !important",
  },
});
