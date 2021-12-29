// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  container: {
    width: "100%",
    padding: 20,
    display: "flex",
  },
  left_container: {
    width: "70%",
    padding: 10,
  },
  right_container: {
    width: "30%",
    padding: 10,
  },
  flex_container: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
