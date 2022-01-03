// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  left_container: {
    padding: "18px 20px",
    width: "40%",
  },
  flex_container: {
    display: "flex",
    justifyContent: "space-between",
  },
  my_sub: {
    width: "100%",
    boxShadow:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    padding: 10,
    backgroundColor: "white",
    marginTop: 10,
  },
  my_sub_info: {
    fontSize: 20,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  right_container: {
    padding: "18px 20px",
    width: "60%",
  },
  form: {
    marginTop: "auto",
    marginBottom: "auto",
    width: "45vw",
  },
  btn: {
    backgroundColor: "#3b373c !important",
  },
});
