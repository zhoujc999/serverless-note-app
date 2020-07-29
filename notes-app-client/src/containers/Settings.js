import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import {
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js";
import CardSection from "./CardSection";
import { useFormFields } from "../libs/hooksLib";
import config from "../config";

const Settings = () => {
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: ""
  });

  const validateForm = () => {
    return (
      fields.name !== "" &&
      fields.storage !== "" &&
      parseInt(fields.storage) > 0 &&
      isCardComplete
    );
  };

  const billUser = (details) => {
    return API.post(config.apiGateway.NAME, "/payments", {
      body: details
    });
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);

    let clientSecret = "";
    try {
      clientSecret = await billUser({
        storage: parseInt(fields.storage)
      });
    } catch (err) {
      alert(err);
    }

    if (!clientSecret) {
      return;
    }


    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: fields.name,
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      alert(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        history.push("/");
        return;
      }
    }
    setIsLoading(false);
  };

  return (
    <Container className="Settings">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="storage">
          <Form.Label>Storage</Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="0"
            value={fields.storage}
            onChange={handleFieldChange}
          />
        </Form.Group>

        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            autoFocus
            required
            type="text"
            placeholder="Enter name"
            value={fields.name}
            onChange={handleFieldChange}
          />
        </Form.Group>

        <CardSection setIsCardComplete={setIsCardComplete} />
        <Button
          disabled={!stripe || !validateForm()}
          type="submit"
        >
        Confirm order
        </Button>
      </Form>
    </Container>
  );
};

export default Settings;
