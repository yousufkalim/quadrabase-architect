// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const UseStyles = makeStyles({
  container: {
    width: "100vw",
    display: "flex",
  },
  left: {
    width: "50%",
    height: "100vh",
    backgroundColor: "#878289",
    color: "white",
    display: "grid",
    placeItems: "center",
  },
  leftContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  btn: {
    width: "200px",
    color: "white",
    cursor: "pointer",
    backgroundColor: "#3b373c",
    border: "2px solid #d10248",
    padding: "15px",
    borderRadius: "30px",
    transitionProperty: "#d10248 #d10248",
    transitionDuration: "0.5s",
    marginTop: "10px",
    border: "2px solid white",
    "&:hover": {
      backgroundColor: "white",
      color: "#878289",
    },
    // add more classes here
  },
});
