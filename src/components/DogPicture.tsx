import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";
import "../App.css";

function DogPicture() {
  const state = useAppSelector((e) => e);
  // Extracting data from Redux store using useAppSelector hook
  const { status, matches, character } = state.search;
  const [image, setImage] = useState("");

  useEffect(() => {
    async function getDogPicture() {
      // {"message":"https:\/\/images.dog.ceo\/breeds\/australian-shepherd\/sadie.jpg","status":"success"}
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const j = await response.json();
      setImage(j.message);
    }
    if (!character) {
      setImage("");
    }
    if (character) {
      getDogPicture();
    }
    // Running the effect whenever 'character' changes
  }, [character]);

  if (status === SearchStatus.FAILED) {
    return (
      <code>
        <pre>some error occurred</pre>
      </code>
    );
  }

  if (status === SearchStatus.LOADING) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Real Life Image</Card.Title>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  if (status === SearchStatus.IDLE && matches.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Real Life Image</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.ImgOverlay className="img-overlay">
            <Card.Title className="img-overlay--text">
              {character} IRL
            </Card.Title>
          </Card.ImgOverlay>
          <Card.Text className="text-center">
            Using state-of-the-art <strong>machine learning</strong> procedure
            and a <i>touch</i> of <strong>AI</strong>, our algorithms construct
            photorealistic representations of what someone looks like{" "}
            <strong>in real life</strong>.
          </Card.Text>
        </Card.Body>
      </Card>
    </Card>
  );
}

export default DogPicture;
