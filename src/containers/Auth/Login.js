//init
import React, { useState } from "react";
import InputWithLabel from "../../components/InputWithLabel";
import { Typography } from "@mui/material";
import { UpdateStore } from "../../StoreContext";
import { onSubmit } from "../../utils/onLogin";
import { useStyles } from "../../css/login";

// Login component
const Login = () => {
  // intializing useStyle object
  const classes = useStyles();
  // getting update store function from update store context
  const updateStore = UpdateStore();

  // All the required states for registeration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // add more states here

  // returning jsx
  return (
    // main conatiner
    <div className={classes.container}>
      {/* Login form */}
      <form
        onSubmit={(e) => onSubmit(e, email, password, updateStore)}
        className={classes.form}
      >
        {/* main Heading */}
        <Typography variant="h2" gutterBottom>
          Login
        </Typography>
        {/* All fields */}
        <InputWithLabel
          value={email}
          label="Email"
          required={true}
          name="email"
          type="email"
          handleChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <InputWithLabel
          value={password}
          label="Password"
          required={true}
          name="password"
          type="password"
          handleChange={(e) => setPassword(e.target.value)}
        />
        {/* add new fields here */}
        {/* login button */}
        <button type="submit" className={classes.btn}>
          Login
        </button>
      </form>
    </div>
  );
};

// export
export default Login;
