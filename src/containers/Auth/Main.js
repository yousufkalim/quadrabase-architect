import React, { useState } from "react";
import { UseStyles } from "../../css/main";
import { useHistory } from "react-router-dom";

// Routes
import Login from "./Login";
import Logo from "../../assets/Quadralogo.png";

// Main component
const Main = () => {
  // intializing useStyle object
  const classes = UseStyles();
  const history = useHistory();
  // state to switch between pages
  const [currentPage, setCurrentPage] = useState("login");

  // returning JSX
  return (
    // Mian container
    <div className={classes.container}>
      {/* left container */}
      <div className={classes.left}>
        {/* Welcome text and login button */}
        <div className={classes.leftContent}>
          <img src={Logo} alt="" />
          <button
            type="submit"
            className={classes.btn}
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
          </button>
        </div>
      </div>
      {/* form on the right */}
      <Login />
    </div>
  );
};

export default Main;
