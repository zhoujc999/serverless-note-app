import React from "react";
import { Container } from "react-bootstrap";
import "./Home.css";

const Home = () => (
  <Container fluid className="Home">
    <Container className="lander">
      <h1>Scratch</h1>
      <p>A simple note taking app</p>
    </Container>
  </Container>
);

export default Home;
