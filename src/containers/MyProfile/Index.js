// init
import React, { useState, useEffect } from "react";
import { useStyles } from "../../css/myProfile";
import { Store, UpdateStore } from "../../StoreContext";
import moment from "moment";
import api from "../../api";
import { toast } from "react-toastify";

// Importing Components
import Header from "../../components/Header";
import { Grid, Button, Avatar, Typography } from "@mui/material";
import InputWithLabel from "../../components/InputWithLabel";

// component
const Index = () => {
  const classes = useStyles();
  const store = Store();
  const updateStore = UpdateStore();
  // states
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    oldPassword: "old",
    newPassword: "new",
    establishment: "",
    service: "",
  });

  // useEffect to set values
  useEffect(() => {
    setValues({
      first_name: store.user.first_name,
      last_name: store.user.last_name,
      email: store.user.email,
      oldPassword: "",
      newPassword: "",
      establishment: store.user.establishment,
      service: store.user.service,
    });
  }, [store.user]);

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await api(
      "put",
      `/Architects/update/${store.user._id}`,
      values
    );
    updateStore({ loggedIn: true, user: result.data.architect });
    toast.success(result.data.message);
  };

  return (
    <div>
      <Header />
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}
      >
        <div className={classes.left_container}>
          <Avatar style={{ height: 100, width: 100 }} />
          <Typography className={classes.name} gutterBottom variant="h3">
            {store.user.first_name} {store.user.last_name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            Member Since: {moment(store.user.createdAt).format("MMMM Do YYYY")}
          </Typography>
        </div>
        <div className={classes.right_container} onSubmit={handleSubmit}>
          <h1 style={{ width: "100vw", color: "black" }}>My Profile</h1>
          <form className={classes.form} autoComplete="off">
            {/* All fields */}
            <br />

            <Grid container spacing={2}>
              <Grid item zeroMinWidth xs>
                <InputWithLabel
                  label="Firstname"
                  required={true}
                  name="first_name"
                  type="text"
                  value={values.first_name}
                  handleChange={(e) =>
                    handleChange(e.target.name, e.target.value)
                  }
                />
              </Grid>
              <Grid item zeroMinWidth xs>
                <InputWithLabel
                  label="Lastame"
                  required={true}
                  name="last_name"
                  type="text"
                  value={values.last_name}
                  handleChange={(e) =>
                    handleChange(e.target.name, e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <br />
            <InputWithLabel
              label="Email"
              required={true}
              disabled={true}
              name="email"
              type="email"
              value={values.email}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item zeroMinWidth xs>
                <InputWithLabel
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={values.oldPassword}
                  handleChange={(e) =>
                    handleChange(e.target.name, e.target.value)
                  }
                />
              </Grid>
              <Grid item zeroMinWidth xs>
                <InputWithLabel
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  handleChange={(e) =>
                    handleChange(e.target.name, e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <br />
            <InputWithLabel
              label="Establishment"
              required={true}
              name="establishment"
              type="text"
              value={values.establishment}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <br />
            <br />

            <InputWithLabel
              label="Service"
              required={true}
              name="service"
              type="text"
              value={values.service}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <br />
            <br />

            {/* register button */}
            <div style={{ width: "100%", textAlign: "right" }}>
              <Button variant="contained" className={classes.btn} type="submit">
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
