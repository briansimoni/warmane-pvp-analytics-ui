import { Card, Spinner } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";

function Nemisis() {
  // const state = useAppSelector((e) => e);
  // const { status, matches, charachter } = state.search;
  // if (status === SearchStatus.FAILED) {
  //   return (
  //     <code>
  //       <pre>some error occured</pre>
  //     </code>
  //   );
  // }
  // if (status === SearchStatus.LOADING) {
  //   return (
  //     <Card>
  //       <Card.Body>
  //         <Card.Title>Nemisis</Card.Title>
  //         <Spinner animation="border" role="status">
  //           <span className="visually-hidden">Loading...</span>
  //         </Spinner>
  //       </Card.Body>
  //     </Card>
  //   );
  // }
  // if (status === SearchStatus.IDLE && matches.length === 0) {
  //   return (
  //     <Card>
  //       <Card.Body>
  //         <Card.Title>Nemisis</Card.Title>
  //         <h2>?</h2>
  //       </Card.Body>
  //     </Card>
  //   );
  // }
  // const m = {}
  // const totalLosses = matches
  //   .filter((match) => match.outcome !== "Victory")
  //   .forEach((match) => {
  //     match.character_details.filter((char) => {
  //       char.personal_change
  //     })
  //   });
  // return (
  //   <Card>
  //     <Card.Body>
  //       <Card.Title>Nemisis</Card.Title>
  //       <h2 id="total-losses-value">{totalLosses}</h2>
  //       <Card.Text>
  //         The total amount of times {charachter} <strong>lost</strong> this
  //         season
  //       </Card.Text>
  //     </Card.Body>
  //   </Card>
  // );
}

export default Nemisis;
