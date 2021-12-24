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
});
