// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  container: {
    height: 37,
    width: "100vw",
    backgroundColor: "#878289",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 12px",
  },
  logo: {
    height: 30,
  },
  logout: {
    fontSize: 18,
    cursor: "pointer",
  },
});
