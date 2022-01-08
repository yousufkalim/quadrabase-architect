// Init
import React from "react";
import { Switch, Route } from "react-router-dom";
import { Store } from "../StoreContext";

// Routes
import Auth from "../containers/Auth/Main.js";
import Home from "../containers/Home";
import Success from "../containers/Success";
import ProjectLibraries from "../containers/ProjectLibraries/Index";
import Management from "../containers/Stakeholder-Chap0Part2/Index";
import MyProfile from "../containers/MyProfile/Index";
import ProjectView from "../containers/Project/ProjectView";

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
          <Route path="/libraries" component={ProjectLibraries} />
          <Route path="/projectview/:id" component={ProjectView} />
        </>
      )}
    </Switch>
  );
};

export default index;
