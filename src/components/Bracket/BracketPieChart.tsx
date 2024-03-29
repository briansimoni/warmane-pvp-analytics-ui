import { Card, Col, Row, Spinner } from "react-bootstrap";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAppSelector } from "../../app/hooks";
import { SearchStatus } from "../../features/search/search-slice";
import { ClassMatchHistory } from "../../util/MatchDetailsUtil";
import { useState, useEffect } from "react";

interface BracketBreakdownConfig {
  bracket: "2v2" | "3v3" | "5v5";
  title: string;
}

function BracketPieChart(props: BracketBreakdownConfig) {
  const [isSmallerPieChart, setIsSmallerPieChart] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth <= 768) {
        setIsSmallerPieChart(true);
      } else {
        setIsSmallerPieChart(false);
      }
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

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
          <Card.Title>{props.title}</Card.Title>
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
          <Card.Title>{props.title}</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  const pieChartOuterRadius = isSmallerPieChart ? 75 : 150;

  // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const COLORS = ["blue", "purple", "red", "brown", "gray"];

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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const classMatchHistory = new ClassMatchHistory(matches);
  const compOutcomes = classMatchHistory.getCompOutcomes(props.bracket);
  const listedOutcomes = classMatchHistory.listCompOutcomes(compOutcomes);

  listedOutcomes.sort((a, b) => {
    if (a.total > b.total) {
      return -1;
    }
    if (a.total < b.total) {
      return 1;
    }
    return 0;
  });

  const topFour = listedOutcomes.slice(0, 4);

  const pieChartData = topFour.map(({ comp, total }) => ({
    name: comp,
    value: total,
  }));

  const rest = listedOutcomes.slice(5);
  const totalOther = rest.reduce((accumulator, current) => {
    const total = current.total;
    return total + accumulator;
  }, 0);

  pieChartData.push({ name: "other", value: totalOther });

  return (
    <>
      <Row>
        <Col xs={12} sm={6}>
          <Card>
            <Card.Header>Legend</Card.Header>
            <Card.Body>
              <ul>
                {topFour.map(({ comp }, i) => {
                  return (
                    <li key={i}>
                      <strong>{COLORS[i]}:</strong> {comp}
                    </li>
                  );
                })}
                <li>
                  <strong>gray:</strong> Other
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card id="losses-over-time-card">
            <Card.Body className="chart-card-body">
              <Card.Title>({props.bracket})</Card.Title>
              <ResponsiveContainer
                width="100%"
                height="100%"
                className="chart-padding"
              >
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={pieChartOuterRadius}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default BracketPieChart;
