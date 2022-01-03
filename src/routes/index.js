// Init
import React from "react";
import { Switch, Route } from "react-router-dom";
import { Store } from "../StoreContext";
import Home from "../containers/Home";
import Success from "../containers/Success";
import Management from "../containers/Stakeholder-Chap0Part2/Index";
import MyProfile from "../containers/MyProfile/Index";

// Routes
import Auth from "../containers/Auth/Main.js";

const index = () => {
  // getting store out of store context
  const store = Store();
  return (
    <Switch>
      {/* checking if user is logged in or not and redirecting accordingly */}
      <Route path="/success" component={Success} />
      {store.loggedIn !== true ? (
        <>
          <Route path="/" exact component={Auth} />
        </>
      ) : (
        <>
          <Route path="/" exact component={Home} />
          <Route path="/management" component={Management} />
          <Route path="/profile" component={MyProfile} />
        </>
      )}
    </Switch>
  );
};

export default index;
