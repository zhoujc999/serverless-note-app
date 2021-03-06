import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Spinner
} from "react-bootstrap";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import "./Login.css";

const Login = () => {
  const { userHasAuthenticated } = useAppContext();

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = re.test(fields.email.toLowerCase());
    return validEmail && fields.password.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (err) {
      alert(JSON.stringify(err));
      setErrorMessage(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Container className="Login">
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            autoFocus
            required
            type="email"
            placeholder="Enter email"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>

        <Container className="WarningContainer">
          <p className="InvalidWarning">
            {errorMessage}
          </p>
        </Container>

        <Button
          variant="outline-primary"
          disabled={!validateForm() || isLoading}
          type="submit"
          block>
          Login
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            hidden={!isLoading}
          />
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
