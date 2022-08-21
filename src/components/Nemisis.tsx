import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";

function Nemisis() {
  const state = useAppSelector((e) => e);
  const { status, matches, charachter } = state.search;
  if (status === SearchStatus.FAILED) {
    return (
      <code>
        <pre>some error occured</pre>
      </code>
    );
  }
  if (status === SearchStatus.LOADING) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Nemisis</Card.Title>
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
          <Card.Title>Nemisis</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  // TODO figure out why this doens't work
  const m = new Map<string, number>();
  matches
    .filter((match) => match.outcome === "Loss")
    .forEach((match) => {
      const peopleWhoBeatThisPerson = match.character_details.filter(
        (deets) => {
          if (!deets) {
            return false;
          }
          if (!deets.matchmaking_change) {
            return false;
          }
          const matchMakingChange = parseInt(deets.matchmaking_change);
          return matchMakingChange > 0 && deets.charname !== charachter;
        }
      );
      peopleWhoBeatThisPerson.forEach((victor) => {
        if (!m.get(victor.charname)) {
          m.set(victor.charname, 1);
        } else {
          const current = m.get(victor.charname) as number;
          m.set(victor.charname, current + 1);
        }
      });
    });

  let most = 0;
  let nemisis = "";
  m.forEach((wins, victor) => {
    if (wins > most && victor !== "DELETED") {
      most = wins;
      nemisis = victor;
    }
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>Nemisis</Card.Title>
        <h2 id="Nemisis">{nemisis}</h2>
        <Card.Text>
          {charachter} lost to {nemisis} <strong>{most}</strong> times this
          season. And that guy sucks!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Nemisis;
