import Axios from "axios";

export interface MatchDetails {
  team_name: string;
  date: string;
  bracket: string;
  arena: string;
  points_change: string;
  character_details: CharacterDetail | undefined[];
  id: string;
  outcome: string;
  duration: string;
  team?: string;
}

export interface CharacterDetail {
  matchmaking_change: string;
  healingDone: string;
  race?: string;
  gender?: string;
  killingBlows: string;
  teamnamerich: string;
  realm: string;
  damageDone: string;
  charname: string;
  class?: string;
  deaths: string;
  personal_change: string;
  teamname: string;
}

interface CrawlResponse {
  message: string;
}

const api = Axios.create({
  baseURL: "https://21kqq2jgg7.execute-api.us-east-1.amazonaws.com/Prod",
});

async function crawl(character: string, realm: string) {
  const result = await api.post<CrawlResponse>("/crawl", {
    character,
    realm,
  });
  console.log(result.data);
}

async function getMatchData(character: string, realm: string) {
  const result = await api.get<MatchDetails[]>(
    `/matches/${character}@${realm}`
  );
  return result.data;
}

export { crawl, getMatchData };
