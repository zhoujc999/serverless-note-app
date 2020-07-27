import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Spinner
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { s3Upload, s3Remove } from "../libs/awsLib";
import config from "../config";
import "./Note.css";

const NoteAttachment = (props) => {
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  return (
    <Form.Group>
      <Form.Label>Attachment</Form.Label>
      <Container>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={props.note.attachmentUrl}
        >
          {formatFilename(props.note.attachment)}
        </a>
      </Container>
    </Form.Group>
  );
};

const NoteForm = (props) => {
  const validateForm = () => {
    return props.note.content.length > 0;
  };

  return (
    <Form onSubmit={props.handleSubmit}>
      <Form.Group controlId="content">
        <Form.Control
          value={props.note.content}
          as="textarea"
          onChange={e => props.setContent(e.target.value)}
        />
      </Form.Group>
      {props.note.attachment && <NoteAttachment note={props.note} />}
      <Form.Group controlId="file">
        {!props.note.attachment && <Form.Label>Attachment</Form.Label>}
        <Form.Control onChange={props.handleFileChange} type="file" />
      </Form.Group>
      <Button
        variant="outline-primary"
        disabled={!validateForm() || props.isLoading || props.isDeleting}
        type="submit"
        block>
        Save
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          hidden={!props.isLoading}
        />
      </Button>
      <Button
        variant="outline-danger"
        disabled={props.isLoading || props.isDeleting}
        onClick={props.handleDelete}
        block>
        Delete
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          hidden={!props.isDeleting}
        />
      </Button>
    </Form>
  );
};

const Note = () => {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };

  const deleteNote = () => {
    return API.del(config.apiGateway.NAME, `/notes/${id}`);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      if (note.attachment) {
        await s3Remove(note.attachment);
      }
      await deleteNote();
      history.push("/");
    } catch (err) {
      alert(JSON.stringify(err));
      setIsDeleting(false);
    }
  };

  const saveNote = (note) => {
    return API.put(config.apiGateway.NAME, `/notes/${id}`, {
      body: note
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let attachment;
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
        await s3Remove(note.attachment);
      }
      await saveNote({
        content: note.content,
        attachment: attachment || note.attachment
      });
      history.push("/");
    } catch (err) {
      alert(JSON.stringify(err));
      setIsLoading(false);
    }
  };

  const loadNote = (id) => {
    return API.get(config.apiGateway.NAME, `/notes/${id}`);
  };

  useEffect(() => {
    const onLoad = async () => {
      try {
        const note = await loadNote(id);

        if (note.attachment) {
          note.attachmentUrl = await Storage.vault.get(note.attachment);
        }
        setNote(note);

      } catch (err) {
        if (err.response) {
          history.push("/404");
        } else {
          alert(err);
        }
      }
    };
    onLoad();
  }, [id]);

  return (
    <Container className="Note">
      {note
        ? <NoteForm
            note={note}
            isLoading={isLoading}
            isDeleting={isDeleting}
            handleSubmit={handleSubmit}
            handleFileChange={handleFileChange}
            handleDelete={handleDelete}
          />
        : null
      }
    </Container>
  );
};

export default Note;
