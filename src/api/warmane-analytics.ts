import Axios from "axios";
import dayjs from "dayjs";

export type CharacterName = string;

export const Realms = [
  "Blackrock",
  "Icecrown",
  "Lordaeron",
  "Frostmourne",
] as const;

export type Realm = typeof Realms[number];

export type CharacterId = `${CharacterName}@${Realm}`;

export interface MatchDetails {
  id: CharacterId;
  document_key: string;
  created_at: string;
  updated_at: string;
  matchId: string;
  team_name: string;
  bracket: string;
  outcome: string;
  points_change: string;
  date: string;
  duration: string;
  arena: string;
  character_details: CharacterDetail[];
}

export interface CharacterDetail {
  matchmaking_change?: string;
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

export interface CharacterMeta {
  id: string;
  name: string;
  realm: string;
  document_key: string;
  updated_at: string;
  created_at: string;
}

interface GetCrawlerStatusResponse {
  state: "pending" | "running" | "idle" | "errored";
  crawler_last_finished: string;
  crawler_last_started: string;
}

export interface CharacterStatus {
  crawl_last_completed?: string;
  crawl_in_progress: boolean;
  id: string;
}

const BASE_URL =
  process.env.NODE_ENV !== "production"
    ? // ? "https://dev.api.warmane.dog/"
      "http://localhost:4000/"
    : "https://api.warmane.dog/";

const api = Axios.create({
  baseURL: BASE_URL,
});

async function crawl(character: string, realm: string): Promise<void> {
  realm = capitalize(realm);
  character = capitalize(character);
  await api.post("/crawl", {
    name: character,
    realm,
  });
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

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });
}

function capitalize(s: string) {
  if (s === "") {
    return "";
  }
  return s[0].toUpperCase() + s.slice(1);
}

async function getCharacterStats(character: string, realm: string) {
  realm = capitalize(realm);
  character = capitalize(character);
  const result = await api.get<Record<string, any>>(
    `character/stats?name=${character}&realm=${realm}`
  );
  return result.data;
}

export async function getCharacterMetadata(character: string, realm: string) {
  realm = capitalize(realm);
  character = capitalize(character);
  const result = await api.get<CharacterMeta>(
    `/character/${character}@${realm}`
  );
  return result.data;
}

/**
 * Polls the API and resolves when the crawl is completed
 * @param character
 * @param realm
 */
async function waitForCrawlToComplete(character: string, realm: string) {
  const test = await shouldCrawl(character, realm);
  // if (!(await shouldCrawl(character, realm))) {
  //   return;
  // }
  console.log(test);
  if (!test) {
    return;
  }
  await crawl(character, realm);
  let done = false;
  let elapsed = 0;
  while (!done) {
    if (elapsed >= 60000) {
      throw new Error(
        "The crawler is taking over a minute to complete. This person has played a TON of games! Try again in a few minutes."
      );
    }
    await sleep(1000);
    elapsed += 1000;
    const response = await getCrawlerStatus({ character, realm });
    // If we trigger the asynchronous lambda, and we query faster
    // than that lambda writes a message that the crawl has started
    if (["running", "pending"].includes(response.state)) {
      continue;
    }
    if (response.state === "idle") {
      done = true;
    }
  }
}

async function getCrawlerStatus(params: {
  character: string;
  realm: string;
}): Promise<GetCrawlerStatusResponse> {
  let { character, realm } = params;
  realm = capitalize(realm);
  character = capitalize(character);
  const result = await api.get<GetCrawlerStatusResponse>(
    `/character/crawl-state?name=${character}&realm=${realm}`
  );
  return result.data;
}

type GetMatchDetailsResult = {
  continuation_token: boolean;
  matches: MatchDetails[];
};

async function getMatchData(
  character: string,
  realm: string
): Promise<MatchDetails[]> {
  realm = capitalize(realm);
  character = capitalize(character);
  const matchDetails = [];
  let result = await api.get<GetMatchDetailsResult>(
    `character/matches/?name=${character}&realm=${realm}`
  );
  while (result.data.continuation_token) {
    matchDetails.push(result.data.matches);
    result = await api.get<GetMatchDetailsResult>(
      `character/matches/?name=${character}&realm=${realm}&continuation_token=${result.data.continuation_token}`
    );
  }
  return matchDetails.flat();
}

/**
 * should crawl if the player exists and has not already been crawled for in the last 24 hours
 */
async function shouldCrawl(character: string, realm: string): Promise<boolean> {
  realm = capitalize(realm);
  character = capitalize(character);
  // try {
  //   await getCharacterMetadata(character, realm);
  // } catch (error: any) {
  //   if (error.response?.status === 404) {
  //     console.log("Character not found");
  //     return false;
  //   }
  // }
  let response: GetCrawlerStatusResponse;
  try {
    response = await getCrawlerStatus({ character, realm });
    if (response.crawler_last_finished) {
      if (crawledInLast24Hours(response.crawler_last_finished)) {
        console.log("crawled in last 24 hours");
        return false;
      }
    }
  } catch (error: any) {
    console.log(error);
    if (error.response?.status === 404) {
      return true;
    }
    throw error;
  }
  return true;
}

function crawledInLast24Hours(crawlLastCompleted: string): boolean {
  const yesterday = dayjs().subtract(24, "hour");
  return dayjs(crawlLastCompleted).isAfter(yesterday);
}

export {
  getCharacterStats,
  getMatchData,
  waitForCrawlToComplete,
  convertTimestampToDate,
  crawledInLast24Hours,
};
