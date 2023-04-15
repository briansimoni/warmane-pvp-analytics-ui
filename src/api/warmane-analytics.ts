import Axios from "axios";

export interface MatchDetails {
  team_name: string;
  date: string;
  bracket: string;
  arena: string;
  points_change: string;
  character_details: CharacterDetail[]; // | undefined[]; I don't think it can be undefined
  id: string;
  outcome: string;
  duration: string;
  team?: string;
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

export interface CharacterStatus {
  crawl_last_completed?: string;
  crawl_in_progress: boolean;
  id: string;
}

interface CrawlResponse {
  message: string;
}

const api = Axios.create({
  // baseURL: "https://21kqq2jgg7.execute-api.us-east-1.amazonaws.com/Prod",
  baseURL: "https://vgepnlr2he.execute-api.us-east-1.amazonaws.com/Prod",
});

async function crawl(character: string, realm: string) {
  realm = capitalize(realm);
  character = capitalize(character);
  const result = await api.post<CrawlResponse>("/crawl", {
    char: character,
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

/**
 * Polls the API and resolves when the crawl is completed
 * @param character
 * @param realm
 */
async function waitForCrawlToComplete(character: string, realm: string) {
  if (!(await shouldCrawl(character, realm))) {
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
    const response = await getCharacter(character, realm);
    // If we trigger the asynchronous lambda, and we query faster
    // than that lambda writes a message that the crawl has started
    if (response.data === null) {
      continue;
    }
    if (!response.data.crawl_in_progress) {
      done = true;
    }
  }
}

async function getCharacter(character: string, realm: string) {
  realm = capitalize(realm);
  character = capitalize(character);
  const result = await api.get<CharacterStatus | null>(
    `/character/${character}@${realm}`
  );
  return result;
}

async function getMatchData(character: string, realm: string) {
  realm = capitalize(realm);
  character = capitalize(character);
  const result = await api.get<MatchDetails[]>(
    `/matches/${character}@${realm}`
  );
  return result.data;
}

async function shouldCrawl(
  character: string,
  realm: string
): Promise<boolean> {
  realm = capitalize(realm);
  character = capitalize(character);
  const response = await getCharacter(character, realm);
  if (response.data?.crawl_last_completed) {
    if (crawledInLast24Hours(response.data.crawl_last_completed)) {
      return false;
    }
  }
  return true;
}

function crawledInLast24Hours(crawlLastCompleted: string): boolean {
  if (crawlLastCompleted) {
    const then = convertTimestampToDate(crawlLastCompleted);
    const now = new Date();

    const msBetweenDates = Math.abs(then.getTime() - now.getTime());

    // 👇️ convert ms to hours                  min  sec   ms
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

    if (hoursBetweenDates < 24) {
      return true;
    }
  }
  return false;
}

export {
  getMatchData,
  getCharacter,
  waitForCrawlToComplete,
  convertTimestampToDate,
};
