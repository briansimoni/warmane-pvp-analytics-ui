import { Card, Spinner, Table } from "react-bootstrap";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";
import {
  ClassMatchHistory,
  convertIntClassToString,
  WowClass,
} from "../util/MatchDetailsUtil";

function SoloQueueBreakDown() {
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

  // const data = [
  //   { name: "Group A", value: 400 },
  //   { name: "Group B", value: 300 },
  //   { name: "Group C", value: 300 },
  //   { name: "Group D", value: 200 },
  // ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const classMatchHistory = new ClassMatchHistory(matches);
  const compOutcomes = classMatchHistory.getCompOutcomes();
  // compOutcomes

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

  const friendlySortedByTotal = compsSortedByTotal.map((comp) => {
    const name = comp[0];
    const results = comp[1];
    return [convertToFriendlyName(name), results];
  });

  const topFour = compsSortedByTotal.slice(0, 4);
  const data = topFour.map((comp) => ({
    name: convertToFriendlyName(comp[0]),
    value: comp[1].total,
  }));

  console.log(friendlySortedByTotal);

  const rest = compsSortedByTotal.slice(5);
  const totalOther = rest.reduce((prev, current) => {
    const total = current[1].total;
    return total + prev;
  }, 0);

  data.push({ name: "other", value: totalOther });

  return (
    <>
      <Card id="losses-over-time-card">
        <Card.Body>
          <Card.Title>Pie Chart</Card.Title>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Enemy Comp</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Total Games</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {friendlySortedByTotal.slice(0, 15).map((comp, index) => {
            const name = comp[0] as string;
            const { wins, losses, total } = comp[1] as {
              wins: number;
              losses: number;
              total: number;
            };
            return (
              <tr key={index}>
                <td>{name}</td>
                <td>{wins}</td>
                <td>{losses}</td>
                <td>{total}</td>
                <td>{Math.round((wins / total) * 100)}%</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default SoloQueueBreakDown;
