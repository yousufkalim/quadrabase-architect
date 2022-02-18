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
import LanguageIcon from "@mui/icons-material/Language";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

// Component
export default function Header() {
  const { i18n, t } = useTranslation();
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

  // for language dropdown menu

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
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
      <div>
        {/* change language button */}
        <IconButton
          id="demo-positioned-button"
          aria-controls={open2 ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open2 ? "true" : undefined}
          onClick={handleClick2}
          style={{ color: "#3b373c" }}
        >
          <LanguageIcon />
        </IconButton>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl2}
          open={open2}
          onClose={handleClose2}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ mt: 2.5 }}
        >
          <MenuItem
            style={{
              width: 200,
              height: 30,
            }}
            onClick={() => {
              i18n.changeLanguage("en");
              handleClose2();
            }}
          >
            {t("English")}
          </MenuItem>
          <MenuItem
            style={{
              width: 200,
              height: 30,
            }}
            onClick={() => {
              i18n.changeLanguage("fr");
              handleClose2();
            }}
          >
            {t("French")}
          </MenuItem>
        </Menu>
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
            style={{ width: 250 }}
            onClick={() => history.push("/management")}
          >
            {t("Stakeholders")}/Chap0Part2
          </MenuItem>
          <MenuItem
            style={{ width: 250 }}
            onClick={() => history.push("/libraries")}
          >
            {t("Project Libraries")}
          </MenuItem>
          <MenuItem onClick={() => history.push("/profile")}>
            {t("My Profile")}
          </MenuItem>

          <Divider />
          <MenuItem
            onClick={() => {
              onLogout();
              history.push("/");
            }}
          >
            {t("Logout")}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
