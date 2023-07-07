import Axios from "axios";
import { /*CharacterName,*/ CharacterId, Realm } from "./types";

// //todo getCharacterMetadata (implement)
// interface SingleCharacterMeta {
//   id: CharacterId;
//   name: CharacterName;
//   realm: Realm;
//   games_played?: number;
// }
// //todo: queryCharacterMetadata (implement)
// interface CharacterMetaArray extends Array<SingleCharacterMeta> {}

// //? may be unnecessary
// interface CharacterMeta extends SingleCharacterMeta {}
// type CharacterMetaUnion = CharacterMeta | CharacterMetaArray;

//todo: getCharacterStats (implement)
export interface ArenaStats {
  "Arenas won"?: number;
  "Arenas played"?: number;
  "5v5 matches"?: number;
  "5v5 victories"?: number;
  "3v3 matches"?: number;
  "3v3 victories"?: number;
  "2v2 matches"?: number;
  "2v2 victories"?: number;
  "Circle of Blood matches"?: number;
  "Circle of Blood victories"?: number;
  "Dalaran Sewers matches"?: number;
  "Dalaran Sewers victories"?: number;
  "Ring of Trials matches"?: number;
  "Ring of Trials victories"?: number;
  "Ring of Valor matches"?: number;
  "Ring of Valor victories"?: number;
  "Ruins of Lordaeron matches"?: number;
  "Ruins of Lordaeron victories"?: number;
  "Highest 5 man personal rating"?: number;
  "Highest 3 man personal rating"?: number;
  "Highest 2 man personal rating"?: number;
  "Highest 5 man team rating"?: number;
  "Highest 3 man team rating"?: number;
  "Highest 2 man team rating"?: number;
}

//todo: getCrawlerState (implement)
export interface CrawlerState {
  id: CharacterId;
  state: "pending" | "running" | "idle" | "errored";
  crawler_last_started?: string;
  crawler_last_finished?: string;
  crawler_errors?: string[];
}

// getMatchData
export interface CharacterDetail {
  realm: Realm;
  charname: string;
  class?: string;
  race?: string;
  gender?: string;
  teamname: string;
  teamnamerich: string;
  damageDone: string;
  deaths: string;
  healingDone: string;
  killingBlows: string;
  matchmaking_change?: string;
  personal_change: string;
}

export interface MatchDetailsResponse {
  matches: MatchDetails[];
  continuation_token?: string;
}

export interface MatchDetails {
  id: CharacterId;
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

// //* V2 Production
// const api = Axios.create({
//   baseURL: " https://3f4vzhst3h.execute-api.us-east-1.amazonaws.com/prod"
// })

//* V2 Development
const api = Axios.create({
  baseURL: "  https://0y910m5kad.execute-api.us-east-1.amazonaws.com/dev",
});

async function crawl(name: string, realm: string) {
  realm = capitalize(realm);
  name = capitalize(name);
  const result = await api.post("/crawl", {
    name,
    realm,
  });
  return result;
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

async function waitForCrawlToComplete(name: string, realm: string) {
  if (!(await shouldCrawl(name, realm))) {
    return;
  }
  await crawl(name, realm);
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
    const response = await getCrawlerState(name, realm);

    // if we trigger the async lambda & query before it can write `crawler_last_started`
    if (response.data === null) {
      continue;
    }
    if (!response.data.crawler_last_started) {
      done = true;
    }
  }
}

async function getCrawlerState(name: string, realm: string) {
  realm = capitalize(realm);
  name = capitalize(name);
  const result = await api.get<CrawlerState | null>(
    `/character/crawl-state?name=${name}&realm=${realm}`
  );
  return result;
}

async function getMatchData(
  name: string,
  realm: string,
  continuation_token?: string
) {
  realm = capitalize(realm);
  name = capitalize(name);

  let url = `/character/matches?name=${name}&realm=${realm}`;

  if (continuation_token) {
    url += `&continuation_token=${continuation_token}`;
  }

  const result = await api.get<MatchDetailsResponse>(url);

  return result;
}

async function shouldCrawl(name: string, realm: string): Promise<boolean> {
  realm = capitalize(realm);
  name = capitalize(name);
  // get crawler state (for specified character)
  const response = await getCrawlerState(name, realm);
  // if it has property 'crawler_last_finished')
  if (response.data?.crawler_last_finished) {
    // check if the crawl was done in last 24 hours
    if (crawledInLast24Hours(response.data.crawler_last_finished)) {
      // if it has crawled in last 24 hours -> 'shouldCrawl' = false
      return false;
    }
  }
  // else -> 'shouldCrawl' = true
  return true;
}

function crawledInLast24Hours(crawlerLastFinished: string): boolean {
  // if character metadata has property `crawler_last_finished`
  if (crawlerLastFinished) {
    // date object representing crawlerLastFinished
    const then = new Date(crawlerLastFinished);
    // date object representing present time
    const now = new Date();

    // gets difference in ms between then and now
    const msBetweenDates = Math.abs(then.getTime() - now.getTime());

    // 👇️ converts ms to hours                 min  sec    ms
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

    if (hoursBetweenDates < 24) {
      return true;
    }
  }
  return false;
}

export { getMatchData, getCrawlerState, waitForCrawlToComplete };
