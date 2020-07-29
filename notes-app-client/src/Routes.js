import React from "react";
import {
  Route,
  Switch
} from "react-router-dom";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./routes/UnauthenticatedRoute";
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
    <UnauthenticatedRoute exact path="/login">
      <Login />
    </UnauthenticatedRoute>
    <UnauthenticatedRoute exact path="/signup">
      <Signup />
    </UnauthenticatedRoute>
    <AuthenticatedRoute exact path="/settings">
      <Settings />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/notes/new">
      <NewNote />
    </AuthenticatedRoute>
    <AuthenticatedRoute exact path="/notes/:id">
      <Note />
    </AuthenticatedRoute>
    <Route>
      <NotFound />
    </Route>
  </Switch>
);

export default Routes;
