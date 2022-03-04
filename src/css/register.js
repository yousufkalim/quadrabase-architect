// init
import { makeStyles } from "@mui/styles";

// makeStyles from material UI for styling
export const useStyles = makeStyles({
  container: {
    width: "50%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#3b373c",
    "@media (max-width: 1480px)": {
      width: "60%",
    },
    "@media (max-width: 1250px)": {
      width: "65%",
    },
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
  borderText: {
    position: "relative",
    marginLeft: 10,
    backgroundColor: "#eeeeee",
    color: "gray",
    padding: 5,
    zIndex: 0,
  },
  borderBox: {
    width: "100%",
    height: 100,
    border: "1px solid lightgray",
    borderRadius: 5,
    marginTop: -12,
    padding: "10px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  textContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: -8,
    "@media (max-width: 1250px)": {
      marginBottom: -5,
    },
  },

  middleBorderBox: {
    width: "100%",
    height: 50,
    border: "1px solid lightgray",
    borderRadius: 5,
    marginTop: -12,
    padding: "10px 10px",
  },
  middleTextContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: -10,
    padding: 5,
  },
  page4BorderBox: {
    width: "100%",
    height: 210,
    border: "1px solid lightgray",
    borderRadius: 5,
    marginTop: -12,
    padding: "10px 10px",
  },
  page4BottomBorderBox: {
    width: "100%",
    height: 60,
    border: "1px solid lightgray",
    borderRadius: 5,
    marginTop: -12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  middleBox: {
    width: "10%",
    height: 100,
    border: "1px solid lightgray",
    borderRadius: 5,
    marginTop: 12,
    padding: 10,
    "@media (max-width: 1780px)": {
      width: "15%",
    },
  },
  middleBox2: {
    width: "10%",
    height: 50,
    border: "1px solid lightgray",
    borderRadius: 5,
    marginTop: 12,
    padding: "5px 10px",
    "@media (max-width: 1780px)": {
      width: "15%",
    },
  },
  rightBox: {
    width: "30%",
    "@media (max-width: 1780px)": {
      width: "25%",
    },
  },
  mainBox: {
    width: "100%",
    "@media (max-width: 1550px)": {
      fontSize: 15,
    },
    "@media (max-width: 1350px)": {
      fontSize: 14,
    },
    "@media (max-width: 1200px)": {
      fontSize: 13,
    },
  },
});
