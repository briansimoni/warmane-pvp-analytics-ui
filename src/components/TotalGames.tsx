import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { Status } from "../features/search/search-slice";

function TotalGames() {
  const state = useAppSelector((e) => e);
  const { status, matches, charachter } = state.search;

  if (status === Status.FAILED) {
    return (
      <code>
        <pre>some error occured</pre>
      </code>
    );
  }

  if (status === Status.LOADING) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Total Games</Card.Title>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  if (status === Status.IDLE && matches.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Total Games</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Total Games.</Card.Title>
        <h2 id="total-losses-value">{matches.length}</h2>
        <Card.Text>
          The total amount games played by {charachter} this season. Wow! That
          is a lot of games. What a loser!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TotalGames;
