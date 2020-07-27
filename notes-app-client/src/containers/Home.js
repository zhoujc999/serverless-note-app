import React, { useState, useEffect } from "react";
import {
  Container,
  ListGroup
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import config from "../config";
import "./Home.css";

const NotesList = (props) => {
  return [{}].concat(props.notes).map((note, i) =>
    i !== 0 ? (
      <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
        <ListGroup.Item header={note.content.trim().split("\n")[0]}>
          {"Created: " + new Date(note.createdAt).toLocaleString()}
        </ListGroup.Item>
      </LinkContainer>
    ) : (
      <LinkContainer key="new" to="/notes/new">
        <ListGroup.Item>
          <h4>
            <b>{"\uFF0B"}</b> Create a new note
          </h4>
        </ListGroup.Item>
      </LinkContainer>
    )
  );
};

const Lander = () => (
  <Container className="Lander">
    <h1>Scratch</h1>
    <p>A simple note taking app</p>
  </Container>
);

const Notes = (props) => (
  <div className="Notes">
    <h3>Your Notes</h3>
    <ListGroup>
      {!props.isLoading && <NotesList notes={props.notes} />}
    </ListGroup>
  </div>
);

const Home = () => {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = () => {
    return API.get(config.apiGateway.NAME, "/notes");
  };

  useEffect(() => {
    const onLoad = async () => {
      setIsLoading(true);
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (err) {
        alert(err.message);
      }

      setIsLoading(false);
    };
    onLoad();
  }, [isAuthenticated]);

  return (
    <Container fluid className="Home">
      {isAuthenticated ? <Notes notes={notes} isLoading={isLoading} /> : <Lander />}
    </Container>
  );
};

export default Home;
