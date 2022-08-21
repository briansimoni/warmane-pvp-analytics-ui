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
import { MatchDetails } from "../api/warmane-analytics";
import { useAppSelector } from "../app/hooks";
import { SearchStatus } from "../features/search/search-slice";

const WARRIOR = "1";
const PALADIN = "2";
const HUNTER = "3";
const ROGUE = "4";
const PRIEST = "5";
const DEATHKNIGHT = "6";
const SHAMAN = "7";
const MAGE = "8";
const WARLOCK = "9";
const DRUID = "11";

function ClassWinRate() {
  const state = useAppSelector((e) => e);
  const { status, matches } = state.search;

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

  function removeFriendlies(matches: MatchDetails[]): MatchDetails[] {
    const result: MatchDetails[] = [];
    matches.forEach((match) => {
      let newMatch = {
        ...match,
      };
      const matchEnemies = match.character_details.filter((detail) => {
        if (detail.matchmaking_change) {
          if (match.outcome !== "Victory") {
            return parseInt(detail.matchmaking_change) > 0;
          } else {
            return parseInt(detail.matchmaking_change) < 0;
          }
        }
        return false;
      });
      newMatch.character_details = matchEnemies;
      result.push(newMatch);
    });
    return result;
  }

  function getClassMatches(matchs: MatchDetails[], wowClass: string) {
    const matchesWithOnlyEnemies = removeFriendlies(matches);

    const filteredByClass = matchesWithOnlyEnemies.filter((match) => {
      return match.character_details.find((char) => char.class === wowClass);
    });

    return filteredByClass;
  }

  const warlockWins = getClassMatches(matches, WARLOCK).filter(
    (match) => match.outcome === "Victory"
  );
  const warlockLosses = getClassMatches(matches, WARLOCK).filter(
    (match) => match.outcome !== "Victory"
  );

  const druidWins = getClassMatches(matches, DRUID).filter(
    (match) => match.outcome === "Victory"
  );
  const druidLosses = getClassMatches(matches, DRUID).filter(
    (match) => match.outcome !== "Victory"
  );

  const warriorWins = getClassMatches(matches, WARRIOR).filter(
    (match) => match.outcome === "Victory"
  );

  const warriorLosses = getClassMatches(matches, WARRIOR).filter(
    (match) => match.outcome !== "Victory"
  );

  const paladinWins = getClassMatches(matches, PALADIN).filter(
    (match) => match.outcome === "Victory"
  );

  const paladinLosses = getClassMatches(matches, PALADIN).filter(
    (match) => match.outcome !== "Victory"
  );

  const rogueWins = getClassMatches(matches, ROGUE).filter(
    (match) => match.outcome === "Victory"
  );

  const rogueLosses = getClassMatches(matches, ROGUE).filter(
    (match) => match.outcome !== "Victory"
  );

  const priestWins = getClassMatches(matches, PRIEST).filter(
    (match) => match.outcome === "Victory"
  );

  const priestLosses = getClassMatches(matches, PRIEST).filter(
    (match) => match.outcome !== "Victory"
  );

  const deathKnightWins = getClassMatches(matches, DEATHKNIGHT).filter(
    (match) => match.outcome === "Victory"
  );

  const deathKnightLosses = getClassMatches(matches, DEATHKNIGHT).filter(
    (match) => match.outcome !== "Victory"
  );

  const shamanWins = getClassMatches(matches, SHAMAN).filter(
    (match) => match.outcome === "Victory"
  );

  const shamanLosses = getClassMatches(matches, SHAMAN).filter(
    (match) => match.outcome !== "Victory"
  );

  const hunterWins = getClassMatches(matches, HUNTER).filter(
    (match) => match.outcome === "Victory"
  );

  const hunterLosses = getClassMatches(matches, HUNTER).filter(
    (match) => match.outcome !== "Victory"
  );

  const mageWins = getClassMatches(matches, MAGE).filter(
    (match) => match.outcome === "Victory"
  );

  const mageLosses = getClassMatches(matches, MAGE).filter(
    (match) => match.outcome !== "Victory"
  );
  const data = [
    {
      name: "Warlock",
      losses: warlockLosses.length,
      wins: warlockWins.length,
      // amt: 2400,
    },
    {
      name: "Druid",
      losses: druidLosses.length,
      wins: druidWins.length,
      // amt: 2400,
    },
    {
      name: "Warrior",
      losses: warriorLosses.length,
      wins: warriorWins.length,
      // amt: 2400,
    },
    {
      name: "Paladin",
      losses: paladinLosses.length,
      wins: paladinWins.length,
      // amt: 2400,
    },
    {
      name: "Rogue",
      losses: rogueLosses.length,
      wins: rogueWins.length,
      // amt: 2400,
    },
    {
      name: "Priest",
      losses: priestLosses.length,
      wins: priestWins.length,
      // amt: 2400,
    },
    {
      name: "Death Knight",
      losses: deathKnightLosses.length,
      wins: deathKnightWins.length,
      // amt: 2400,
    },
    {
      name: "Shaman",
      losses: shamanLosses.length,
      wins: shamanWins.length,
      // amt: 2400,
    },
    {
      name: "Hunter",
      losses: hunterLosses.length,
      wins: hunterWins.length,
      // amt: 2400,
    },
    {
      name: "Mage",
      losses: mageLosses.length,
      wins: mageWins.length,
      // amt: 2400,
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
