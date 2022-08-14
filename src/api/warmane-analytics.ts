import Axios from "axios";

export interface MatchDetails {
  team_name: string;
  date: string;
  bracket: string;
  arena: string;
  points_change: string;
  character_details: CharacterDetail[]; // | undefined[]; I don't think it can be undfined
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

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });
}

async function pollCrawlStatus(character: string, realm: string) {
  let done = false;
  let elapsed = 0;
  while (!done) {
    elapsed += 250;
    await sleep(250);
    if (elapsed >= 60000) {
      throw new Error("Crawler timeout");
    }
    const response = await getCharachter(character, realm);
    if (response.data === null) {
      continue;
    }
    if (
      !response.data.crawl_last_completed &&
      response.data.crawl_last_started
    ) {
      done = true;
    }
  }
}

async function getCharachter(character: string, realm: string) {
  const result = await api.get<CharacterStatus | null>(
    `/charachter/${character}@${realm}`
  );
  return result;
}

async function getMatchData(character: string, realm: string) {
  const result = await api.get<MatchDetails[]>(
    `/matches/${character}@${realm}`
  );
  return result.data;
}

async function doItAll(
  character: string,
  realm: string
): Promise<MatchDetails[]> {
  const charResponse = await getCharachter(character, realm);
  console.log("charResponse", charResponse);
  if (charResponse.data === null) {
    await crawl(character, realm);
    await pollCrawlStatus(character, realm);
    const response = await getMatchData(character, realm);
    return response;
  }
  const crawlLastCompleted = charResponse.data?.crawl_last_completed;
  if (crawlLastCompleted) {
    const then = convertTimestampToDate(crawlLastCompleted);
    const now = new Date();

    const msBetweenDates = Math.abs(then.getTime() - now.getTime());

    // 👇️ convert ms to hours                  min  sec   ms
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

    if (hoursBetweenDates < 24) {
      const response = await getMatchData(character, realm);
      console.log("this response", response);
      return response;
    } else {
      await crawl(character, realm);
      await pollCrawlStatus(character, realm);
      const response = await getMatchData(character, realm);
      return response;
    }
  }

  console.log("returning nothing");
  return [];
}

export {
  crawl,
  getMatchData,
  getCharachter,
  pollCrawlStatus,
  convertTimestampToDate,
  doItAll,
};
