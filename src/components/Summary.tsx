import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";
import ListGroup from "react-bootstrap/ListGroup";
import "../App.css";

function Summary() {
  const state = useAppSelector((e) => e);
  const { status, matches, character } = state.search;

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
          <Card.Title>Summary</Card.Title>
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
          <Card.Title>Summary</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  const totalLosses = matches.filter(
    (match) => match.outcome !== "Victory"
  ).length;

  const winRate = (matches.length - totalLosses) / matches.length;
  const winRatePercentage = Math.round(winRate * 100);


  return (
    <Card>
      <Card.Body>
        <ListGroup variant="flush">
          <Card.Header>
            Total Games:{" "}
            <h2 className="card-stat-value" id="total-matches-played">
              {matches.length}
            </h2>
          </Card.Header>
          <ListGroup.Item>
            <Card.Text>
              That's how many games {character} played <i>this season</i>. Wow!
              That's a lot, probably too many games. {character} needs to touch
              some grass.
            </Card.Text>
          </ListGroup.Item>
          <Card.Header>
            Total Losses:{" "}
            <h2 className="card-stat-value" id="total-losses">
              {totalLosses}
            </h2>
          </Card.Header>
          <ListGroup.Item>
            <Card.Text>
              If it wasn't obvious already that {character} is a loser, this is
              proof.
            </Card.Text>
          </ListGroup.Item>
          <Card.Header>
            Win Rate:{" "}
            <h2 className="card-stat-value" id="win-rate-percentage">
              {winRatePercentage}%
            </h2>
          </Card.Header>
          <ListGroup.Item>
            <Card.Text>Hopefully there's a grading curve...</Card.Text>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default Summary;
