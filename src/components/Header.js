// Init
import React from "react";
import { useStyles } from "../css/header";
import Logo from "../assets/Quadralogo.png";
import { UpdateStore } from "../StoreContext";
import LogoutIcon from "@mui/icons-material/Logout";

// Component
export default function Header() {
  const classes = useStyles();
  const updateStore = UpdateStore();

  //   logout function
  const onLogout = () => {
    localStorage.removeItem("token");
    updateStore({ loggedIn: false, user: {} });
  };

  return (
    <div className={classes.container}>
      <img className={classes.logo} src={Logo} alt="" />
      <LogoutIcon className={classes.logout} fontSize="md" onClick={onLogout} />
    </div>
  );
}
