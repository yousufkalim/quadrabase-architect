import React from "react";
import { UseStyles } from "../../css/main";
// Routes
import Login from "./Login";
import Logo from "../../assets/Quadralogo.png";

// Main component
const Main = () => {
  // intializing useStyle object
  const classes = UseStyles();

  // returning JSX
  return (
    // Mian container
    <div className={classes.container}>
      {/* left container */}
      <div className={classes.left}>
        {/* Welcome text and login button */}
        <div className={classes.leftContent}>
          <img src={Logo} alt="" />
        </div>
      </div>
      {/* form on the right */}
      <Login />
    </div>
  );
};

export default Main;
