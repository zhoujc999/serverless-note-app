import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Spinner
} from "react-bootstrap";
import { API } from "aws-amplify";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import "./NewNote.css";


const NewNote = () => {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return content.length > 0;
  };

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };

  const createNote = (note) => {
    return API.post(config.apiGateway.NAME, "/notes", {
      body: note
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createNote({ content, attachment });
      history.push("/");
    } catch (err) {
      alert(JSON.stringify(err));
      setIsLoading(false);
    }

  };

  return (
    <Container className="NewNote">
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <Button
          variant="outline-primary"
          disabled={!validateForm() || isLoading}
          type="submit"
          block>
          Create
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

export default NewNote;
