import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";

function Nemisis() {
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
          return matchMakingChange > 0 && deets.charname !== character;
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
        <Card.Header>
          Nemisis:{" "}
          <h2 className="card-stat-value" id="Nemisis">
            {nemisis}
          </h2>
        </Card.Header>
        <Card.Title></Card.Title>
        <Card.Text className="text-center">
          {character} lost to {nemisis} a whopping <strong>{most}</strong> times
          this season&mdash;and that guy sucks!
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Nemisis;
