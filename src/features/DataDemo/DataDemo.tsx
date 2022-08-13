import { useAppSelector } from "../../app/hooks";

function DataDemo() {
  const matchData = useAppSelector((e) => e.search.value);
  const stringifiedData = JSON.stringify(matchData, null, 2);

  return (
    <code>
      <pre>{stringifiedData}</pre>
    </code>
  );
}

export default DataDemo;
