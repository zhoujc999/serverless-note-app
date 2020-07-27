import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import config from "../config";

const Settings = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);

  const billUser = (details) => {
    return API.post(config.apiGateway.NAME, "/billing", {
      body: details
    });
  };

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_PUBLIC_KEY));
  }, []);

  return (
    <Container className="Settings">
    </Container>
  );
};

export default Settings;
