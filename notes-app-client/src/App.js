import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Navbar,
  Nav,
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import "./App.css";



const App = () => {
  // check if the user needs to authenticate
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch(err) {
      if (err !== 'No current user') {
        alert(err);
      }
    };

    setIsAuthenticating(false);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      userHasAuthenticated(false);
      history.push("/login");
    } catch (err) {
      alert(err);
    };
  };

  return (
    !isAuthenticating &&
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>
          <Link to="/">Scratch</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            {isAuthenticated
              ? <>
                  <Nav.Item>
                    <Nav.Link href="/settings">Settings</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </Nav.Item>
                </>
              : <>
                  <Nav.Item>
                    <Nav.Link href="/signup">Signup</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav.Item>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </AppContext.Provider>
    </>
  );
};

export default App;
