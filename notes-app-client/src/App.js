import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
} from "react-bootstrap";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Routes from "./Routes";
import "./App.css";

const App = () => (
  <Container>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>
        <Link to="/">Scratch</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="ml-auto">
          <Nav.Link href="/signup">Signup</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Routes />
  </Container>
);

export default App;
