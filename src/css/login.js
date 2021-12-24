// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI to add custom styling
export const useStyles = makeStyles({
  container: {
    width: "50%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    color: "#3b373c",
  },
  form: {
    marginTop: "auto",
    marginBottom: "auto",
    width: "75%",
    textAlign: "center",
  },
  btn: {
    width: "200px",
    color: "white",
    cursor: "pointer",
    backgroundColor: "#3b373c",
    border: "2px solid #878289",
    padding: "15px",
    borderRadius: "30px",
    transitionProperty: "#878289 #878289",
    transitionDuration: "0.5s",
    marginTop: "10px",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#3b373c",
    },
    // add more classes here
  },
});
