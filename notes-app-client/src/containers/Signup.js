import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Spinner
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";



const SignupForm = (props) => (
  <Form noValidate onSubmit={props.handleSubmit}>
    <Form.Group controlId="email">
      <Form.Label>Email address</Form.Label>
      <Form.Control
        autoFocus
        required
        type="email"
        placeholder="Enter email"
        value={props.fields.email}
        onChange={props.handleFieldChange}
      />
      <Form.Text className="text-muted">
        Please check your email for the code.
      </Form.Text>
    </Form.Group>

    <Form.Group controlId="password">
      <Form.Label>Password</Form.Label>
      <Form.Control
        required
        type="password"
        placeholder="Password"
        value={props.fields.password}
        onChange={props.handleFieldChange}
      />
    </Form.Group>

    <Form.Group controlId="confirmPassword">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control
        required
        type="password"
        placeholder="Password"
        value={props.fields.confirmPassword}
        onChange={props.handleFieldChange}
      />
    </Form.Group>

    <Button
      variant="outline-primary"
      disabled={!props.validateForm() || props.isLoading}
      type="submit"
      block>
      Signup
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        hidden={!props.isLoading}
      />
    </Button>
  </Form>
);

const ConfirmationForm = (props) => (
  <Form noValidate onSubmit={props.handleConfirmationSubmit}>
    <Form.Group controlId="confirmationCode">
      <Form.Label>Confirmation Code</Form.Label>
      <Form.Control
        autoFocus
        required
        type="tel"
        placeholder="Enter code"
        value={props.fields.confirmationCode}
        onChange={props.handleFieldChange}
      />
      <Form.Text className="text-muted">
        Please check your email for the code.
      </Form.Text>
    </Form.Group>

    <Button
      variant="outline-primary"
      disabled={!props.validateConfirmationForm() || props.isLoading}
      type="submit"
      block>
      Submit
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        hidden={!props.isLoading}
      />
    </Button>
  </Form>
);

const Signup = () => {
  const { userHasAuthenticated } = useAppContext();
  const history = useHistory();

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateForm = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = re.test(fields.email.toLowerCase());
    return (
      validEmail &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  };

  const validateConfirmationForm = () => {
    return fields.confirmationCode.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const code = "531659";
    try {
      await Auth.confirmSignUp(fields.email, code, { forceAliasCreation: false });
    } catch (err) {
      alert(JSON.stringify(err));
      if (err.code !== "UserNotFoundException") {
        alert("Account with email already exists, log in instead.");
        setIsLoading(false);
        return;
      }
    }

    try {
      await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setShowConfirmation(true);
    } catch (err) {
      if (err.code === "UsernameExistsException") {
        await Auth.resendSignUp(fields.email);
        setShowConfirmation(true);
      } else {
        alert(err.message);
      }
    }
    setIsLoading(false);
  };

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push("/");
    } catch (err) {
      alert(err.message);
      setIsLoading(false);
    }
  };

  if (!showConfirmation) {
    return (
    <Container className="Signup">
      <SignupForm
        fields={fields}
        handleFieldChange={handleFieldChange}
        handleSubmit={handleSubmit}
        validateForm={validateForm}
        isLoading={isLoading}
        />
    </Container>
    );
  } else {
    return (
    <Container className="Signup">
        <ConfirmationForm
          fields={fields}
          handleFieldChange={handleFieldChange}
          handleConfirmationSubmit={handleConfirmationSubmit}
          validateConfirmationForm={validateConfirmationForm}
          isLoading={isLoading}
        />
    </Container>
    );
  }
};

export default Signup;
