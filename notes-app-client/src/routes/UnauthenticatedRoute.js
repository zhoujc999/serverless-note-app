import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

const querystring = (name, url) => {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return null;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const UnauthenticatedRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = useAppContext();
  const redirect = querystring("redirect", window.location.href);
  return (
    <Route {...rest}>
      {!isAuthenticated
        ? children
        : <Redirect to={redirect === null ? "/" : redirect} />
      }
    </Route>
  );
};

export default UnauthenticatedRoute;
