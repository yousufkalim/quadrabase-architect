// Init
import React from "react";
import { Switch, Route } from "react-router-dom";
import { Store } from "../StoreContext";
import Home from "../containers/Home";
import Success from "../containers/Success";

// Routes
import Auth from "../containers/Auth/Main.js";

const index = () => {
  // getting store out of store context
  const store = Store();
  return (
    <Switch>
      {/* checking if user is logged in or not and redirecting accordingly */}
      <Route
        path="/"
        exact
        component={() => (store.loggedIn ? <Home /> : <Auth />)}
      />
      <Route path="/success" component={Success} />
    </Switch>
  );
};

export default index;
