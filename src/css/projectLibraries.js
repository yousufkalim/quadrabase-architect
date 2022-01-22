// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  container: {
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    paddingTop: 20,
  },
  btn: {
    backgroundColor: "#3b373c !important",
  },
  btn2: {
    backgroundColor: "#3b373c !important",
    marginRight: "10px important",
    height: 35,
  },
  form: {
    marginTop: "auto",
    marginBottom: "auto",
    textAlign: "left",
    width: "60vw",
    maxHeight: 660,
    overflow: "auto",
  },
  smform: {
    marginTop: "auto",
    marginBottom: "auto",
    textAlign: "left",
    width: "35vw",
  },
  docViewer: {
    height: "400px !important",
    overflow: "scroll !important",
    backgroundColor: "#f9f9f9 !important",
    "& #pdf-controls": {
      display: "none",
    },
  },
});
