import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";

function Summary() {
  const state = useAppSelector((e) => e);
  const { status, matches, charachter } = state.search;

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
        <Card.Title>Total Games</Card.Title>
        <h2 id="total-losses-value">{matches.length}</h2>
        <Card.Text>
          The total amount games played by {charachter} this season. Wow! That
          is a lot of games. {charachter} needs to get outside.
        </Card.Text>
        <Card.Title>Total Losses</Card.Title>
        <h2 id="total-losses-value">{totalLosses}</h2>
        <Card.Text>
          The total amount of times {charachter} <strong>lost</strong> this
          season
        </Card.Text>
        <Card.Title>Win Rate</Card.Title>
        <h2 id="total-losses-value">{winRatePercentage}%</h2>
        <Card.Text>pathetic...</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Summary;
