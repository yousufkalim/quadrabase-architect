// Init
import React, { useState } from "react";
import { useStyles } from "../css/header";
import Logo from "../assets/Quadralogo.png";
import { UpdateStore, Store } from "../StoreContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useHistory } from "react-router";

// Component
export default function Header() {
  const classes = useStyles();
  const updateStore = UpdateStore();
  const store = Store();
  const history = useHistory();

  // for dropdown menu

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   logout function
  const onLogout = () => {
    localStorage.removeItem("token");
    updateStore({ loggedIn: false, user: {} });
  };

  return (
    <div className={classes.container}>
      <img
        className={classes.logo}
        src={Logo}
        alt=""
        onClick={() => history.push("/")}
      />
      {/* dropdonw menu */}
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ color: "#3b373c" }}
      >
        {`${store.user.first_name} ${store.user.last_name}`}
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ mt: 2.5 }}
      >
        <MenuItem
          onClick={handleClose}
          style={{ width: 150 }}
          onClick={() => history.push("/stakeholder")}
        >
          Stakeholders
        </MenuItem>
        <MenuItem onClick={handleClose}>Chap0Part2</MenuItem>
        <MenuItem onClick={handleClose}>My Profile</MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
