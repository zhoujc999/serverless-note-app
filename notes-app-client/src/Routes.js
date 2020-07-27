import React from "react";
import {
  Route,
  Switch
} from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Settings from "./containers/Settings";
import Note from "./containers/Note";
import NewNote from "./containers/NewNote";
import NotFound from "./containers/NotFound";

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route exact path="/login">
      <Login />
    </Route>
    <Route exact path="/signup">
      <Signup />
    </Route>
    <Route exact path="/settings">
      <Settings />
    </Route>
    <Route exact path="/notes/new">
      <NewNote />
    </Route>
    <Route exact path="/notes/:id">
      <Note />
    </Route>
    <Route>
      <NotFound />
    </Route>
  </Switch>
);

export default Routes;
