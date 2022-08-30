import { MatchDetails } from "../api/warmane-analytics";

export enum WowClass {
  WARRIOR = "1",
  PALADIN = "2",
  HUNTER = "3",
  ROGUE = "4",
  PRIEST = "5",
  DEATHKNIGHT = "6",
  SHAMAN = "7",
  MAGE = "8",
  WARLOCK = "9",
  DRUID = "11",
}

/**
 * Given an array of MatchHistory, this will return
 * a new array of MatchHistory where the the charachter_details
 * only contains enemy teams
 * @param matches
 * @returns {MatchDetails[]}
 */
export function removeFriendlies(matches: MatchDetails[]): MatchDetails[] {
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

export class ClassMatchHistory {
  private matches: MatchDetails[];
  private enemiesOnly: MatchDetails[];

  constructor(matches: MatchDetails[]) {
    this.matches = matches;
    this.enemiesOnly = removeFriendlies(matches);
  }

  public getOverallClassHistory(wowClass: WowClass) {
    const filteredByClass = this.enemiesOnly.filter((match) => {
      return match.character_details.find((char) => char.class === wowClass);
    });
    const classWins = filteredByClass.filter(
      (match) => match.outcome === "Victory"
    );
    const classLosses = filteredByClass.filter(
      (match) => match.outcome !== "Victory"
    );
    return [classWins, classLosses];
  }

  // returns an array of solo queue results
  // see the interface
  //
  private getSoloQueueComps() {
    const matches = this.matches.filter((match) => match.bracket === "5v5");
    const matchesWithoutEnemies = removeFriendlies(matches);

    interface soloQueueResult {
      comp: string[];
      outcome: string;
    }

    const data: soloQueueResult[] = [];

    matchesWithoutEnemies.forEach((match) => {
      const classes = match.character_details.map((detail) => detail.class);
      if (classes.includes(undefined)) {
        return;
      }

      const comp = classes.sort() as string[];
      data.push({
        comp,
        outcome: match.outcome,
      });
    });
    return data;
  }

  public getSqWinRatePerComp() {
    const comps = this.getSoloQueueComps()

    interface Comps {
      [index: string]: {
        wins: number
        losses: number
      }
    }

    const data: Comps = {}

    comps.forEach((win) => {
      const key = win.comp.toString();
      if (data[key]) {
        data[key].wins = data[key].wins + data[key].wins + 1
        data.set(key, (data.get(key) as number) + 1);
      } else {
        data.set(key, 1);
      }
    });

    const top10 = Array.from(data)
      .sort(([compA, outcomesA], [compB, outcomesB]) => {
        if (outcomesA > outcomesB) {
          return -1;
        } else if (outcomesA === outcomesB) {
          return 0;
        } else {
          return 1;
        }
      })
      .slice(0, 10);

    const sortedData = new Map(top10);
    return sortedData;
  }
}
