import { Card, Spinner, Tooltip } from "react-bootstrap";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";
import { ClassMatchHistory, WowClass } from "../util/MatchDetailsUtil";

function ClassWinRate() {
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
          <Card.Title>Win Rate Per Class</Card.Title>
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
          <Card.Title>Win Rate Per Class</Card.Title>
          <h2>?</h2>
        </Card.Body>
      </Card>
    );
  }

  const cm = new ClassMatchHistory(matches);
  const [warlockWins, warlockLosses] = cm.getOverallClassHistory(
    WowClass.WARLOCK
  );

  const [druidWins, druidLosses] = cm.getOverallClassHistory(WowClass.DRUID);
  const [warriorWins, warriorLosses] = cm.getOverallClassHistory(
    WowClass.WARRIOR
  );
  const [paladinWins, paladinLosses] = cm.getOverallClassHistory(
    WowClass.PALADIN
  );
  const [rogueWins, rogueLosses] = cm.getOverallClassHistory(WowClass.ROGUE);
  const [priestWins, priestLosses] = cm.getOverallClassHistory(WowClass.PRIEST);
  const [deathKnightWins, deathKnightLosses] = cm.getOverallClassHistory(
    WowClass.DEATHKNIGHT
  );
  const [shamanWins, shamanLosses] = cm.getOverallClassHistory(WowClass.SHAMAN);
  const [hunterWins, hunterLosses] = cm.getOverallClassHistory(WowClass.HUNTER);
  const [mageWins, mageLosses] = cm.getOverallClassHistory(WowClass.MAGE);

  const data = [
    {
      name: "Warlock",
      losses: warlockLosses.length,
      wins: warlockWins.length,
    },
    {
      name: "Druid",
      losses: druidLosses.length,
      wins: druidWins.length,
    },
    {
      name: "Warrior",
      losses: warriorLosses.length,
      wins: warriorWins.length,
    },
    {
      name: "Paladin",
      losses: paladinLosses.length,
      wins: paladinWins.length,
    },
    {
      name: "Rogue",
      losses: rogueLosses.length,
      wins: rogueWins.length,
    },
    {
      name: "Priest",
      losses: priestLosses.length,
      wins: priestWins.length,
    },
    {
      name: "Death Knight",
      losses: deathKnightLosses.length,
      wins: deathKnightWins.length,
    },
    {
      name: "Shaman",
      losses: shamanLosses.length,
      wins: shamanWins.length,
    },
    {
      name: "Hunter",
      losses: hunterLosses.length,
      wins: hunterWins.length,
    },
    {
      name: "Mage",
      losses: mageLosses.length,
      wins: mageWins.length,
    },
  ].sort((a, b) => (a.losses > b.losses ? 1 : -1));

  return (
    <Card id="losses-over-time-card">
      <Card.Body>
        <Card.Title>Win Rate Per Class</Card.Title>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="wins" fill="#198754" />
            <Bar dataKey="losses" fill="#ff0000" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}

export default ClassWinRate;
