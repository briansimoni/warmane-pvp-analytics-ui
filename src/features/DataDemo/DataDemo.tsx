import { Spinner } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { Status } from "../search/search-slice";

function DataDemo() {
  const state = useAppSelector((e) => e);
  const { status, matches } = state.search;
  const stringifiedData = JSON.stringify(matches, null, 2);

  if (status === Status.FAILED) {
    return (
      <code>
        <pre>some error occured</pre>
      </code>
    );
  }

  if (status === Status.LOADING) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (status === Status.IDLE && matches.length === 0) {
    return (
      <code>
        <pre>matches will appear here</pre>
      </code>
    );
  }

  return (
    <code>
      <pre>{stringifiedData}</pre>
    </code>
  );
}

export default DataDemo;
