import React from "react";
import { Container } from "react-bootstrap";
import "./NotFound.css";

const NotFound = () => {
  return (
    <Container className="NotFound">
      <h3>Oops! The page you requested wasn't found.</h3>
    </Container>
  );
}

export default NotFound;
