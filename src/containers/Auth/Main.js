import React, { useState } from "react";
import { UseStyles } from "../../css/main";
// Routes
import Login from "./Login";
import Register from "./Register";
import Logo from "../../assets/Quadralogo.png";

// Main component
const Main = () => {
  // intializing useStyle object
  const classes = UseStyles();
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
              setCurrentPage(currentPage === "login" ? "register" : "login");
            }}
          >
            {currentPage === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
      {/* form on the right */}
      {currentPage === "login" ? (
        <Login />
      ) : (
        <Register setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};

export default Main;
