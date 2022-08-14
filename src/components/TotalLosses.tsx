import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { Status } from "../features/search/search-slice";

function TotalLosses() {
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
          <Card.Title>Total Losses</Card.Title>
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
          <Card.Title>Total Losses</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  const totalLosses = matches.filter(
    (match) => match.outcome !== "Victory"
  ).length;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Total Losses</Card.Title>
        <h2 id="total-losses-value">{totalLosses}</h2>
        <Card.Text>
          The total amount of times {charachter} <strong>lost</strong> this
          season
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TotalLosses;
