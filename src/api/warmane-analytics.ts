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

export interface CharacterStatus {
  crawl_last_completed?: string;
  crawl_last_started?: string;
  id: string;
}

interface CrawlResponse {
  message: string;
}

const api = Axios.create({
  // baseURL: "https://21kqq2jgg7.execute-api.us-east-1.amazonaws.com/Prod",
  baseURL: "https://61hn5v2774.execute-api.us-east-1.amazonaws.com/Prod",
});

async function crawl(character: string, realm: string) {
  const result = await api.post<CrawlResponse>("/crawl", {
    character,
    realm,
  });
  return result;
}

/**
 * the timestamp I'm returning from the API is kind of dumb
 */
function convertTimestampToDate(timestamp: string) {
  const split = timestamp.split(".");
  const seconds = split[0];
  const ms = parseInt(seconds) * 1000;
  return new Date(ms);
}

async function pollCrawlStatus(character: string, realm: string) {
  let done = false;
  while (!done) {
    const response = await getCharacter(character, realm);
    if (
      !response.data.crawl_last_completed &&
      response.data.crawl_last_started
    ) {
      done = true;
    }
  }
}

async function getCharacter(character: string, realm: string) {
  const result = await api.post<CharacterStatus>(
    `/character/${character}@${realm}`,
    {
      character,
      realm,
    }
  );
  return result;
}

async function getMatchData(character: string, realm: string) {
  const result = await api.get<MatchDetails[]>(
    `/matches/${character}@${realm}`
  );
  return result.data;
}

export {
  crawl,
  getMatchData,
  getCharacter,
  pollCrawlStatus,
  convertTimestampToDate,
};
