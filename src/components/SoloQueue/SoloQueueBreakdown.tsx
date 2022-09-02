import { Card, Spinner } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { useAppSelector } from "../../app/hooks";
import { SearchStatus } from "../../features/search/search-slice";
import {
  ClassMatchHistory,
  convertIntClassToString,
  WowClass,
} from "../../util/MatchDetailsUtil";
import SoloQueuePieChart from "./SoloQueuePieChart";

function SoloQueueBreakDown() {
  const state = useAppSelector((e) => e);
  const { status, matches } = state.search;
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
          <Card.Title>Solo Queue BreakDown</Card.Title>
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
          <Card.Title>Solo Queue BreakDown</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  const classMatchHistory = new ClassMatchHistory(matches);
  const compOutcomes = classMatchHistory.getCompOutcomes();
  const niceData = classMatchHistory.listCompOutcomes(compOutcomes);

  const compsSortedByTotal = Object.entries(compOutcomes).sort((a, b) => {
    const aTotal = a[1].total;
    const bTotal = b[1].total;
    if (aTotal > bTotal) {
      return -1;
    }
    if (aTotal < bTotal) {
      return 1;
    }
    return 0;
  });

  function convertToFriendlyName(comp: string) {
    const s = comp.split(",");
    const friendly = s.map((wowClass) =>
      convertIntClassToString(wowClass as WowClass)
    );
    return friendly.join("/");
  }

  const topFour = compsSortedByTotal.slice(0, 4);
  const data = topFour.map((comp) => ({
    name: convertToFriendlyName(comp[0]),
    value: comp[1].total,
  }));

  const rest = compsSortedByTotal.slice(5);
  const totalOther = rest.reduce((prev, current) => {
    const total = current[1].total;
    return total + prev;
  }, 0);

  data.push({ name: "other", value: totalOther });

  interface DataRow {
    comp: string;
    wins: number;
    losses: number;
    total: number;
    winRate: number;
    frequency: number;
  }
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Enemy Comp",
      selector: (row) => row.comp,
      sortable: true,
    },
    {
      name: "Wins",
      selector: (row) => row.wins,
      sortable: true,
    },
    {
      name: "Losses",
      selector: (row) => row.losses,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
    },
    {
      name: "Win Rate",
      selector: (row) => row.winRate,
      sortable: true,
    },
    {
      name: "Frequency",
      selector: (row) => row.frequency,
      sortable: true,
    },
  ];

  return (
    <>
      <SoloQueuePieChart />

      <DataTable columns={columns} data={niceData} dense pagination />
    </>
  );
}

export default SoloQueueBreakDown;
