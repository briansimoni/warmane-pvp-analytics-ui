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

export function convertIntClassToString(wowClass: WowClass) {
  const m = {
    "1": "warrior",
    "2": "paladin",
    "3": "hunter",
    "4": "rogue",
    "5": "priest",
    "6": "deathknight",
    "7": "shaman",
    "8": "mage",
    "9": "warlock",
    "11": "druid",
  };
  return m[wowClass];
}

/**
 * Given an array of MatchHistory, this will return
 * a new array of MatchHistory where the the character_details
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

// the index is a comp for instance "4,5,6"
interface Comps {
  [index: string]: {
    wins: number;
    losses: number;
    total: number;
  };
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
  private getComps(bracket: "5v5" | "3v3" | "2v2") {
    const matches = this.matches.filter((match) => match.bracket === bracket);
    const matchesWithoutEnemies = removeFriendlies(matches);

    interface soloQueueResult {
      comp: string[]; // each element will be a string digit that refers to a wow class for example ["1", "2", "3"]
      outcome: string;
    }

    const data: soloQueueResult[] = [];

    matchesWithoutEnemies.forEach((match) => {
      const classes = match.character_details.map((detail) => {
        if (detail.class) {
          return parseInt(detail.class);
        }
        return undefined;
      });
      if (classes.includes(undefined)) {
        return;
      }

      const comp = classes.sort((a, b) => {
        if (a! < b!) {
          return -1;
        } else if (a! > b!) {
          return 1;
        } else {
          return 0;
        }
      }) as number[];
      data.push({
        comp: comp.toString().split(","),
        outcome: match.outcome,
      });
    });
    return data;
  }

  // gets the total wins and losses per comp
  public getCompOutcomes(bracket: "5v5" | "3v3" | "2v2") {
    const comps = this.getComps(bracket);

    const data: Comps = {};

    comps.forEach((match) => {
      const comp = match.comp.join();
      if (!data[comp]) {
        data[comp] = {
          wins: 0,
          losses: 0,
          total: 0,
        };
      }

      if (match.outcome === "Victory") {
        data[comp].wins++;
        data[comp].total++;
      } else if (match.outcome === "Loss") {
        data[comp].losses++;
        data[comp].total++;
      }
    });

    return data;
  }

  private convertToFriendlyName(comp: string) {
    const s = comp.split(",");
    const friendly = s.map((wowClass) =>
      convertIntClassToString(wowClass as WowClass)
    );
    return friendly.join("/");
  }

  /**
   * instead of returning some useless object where the keys are the comp,
   * return a list of objects
   */
  public listCompOutcomes(comps: Comps) {
    const totalGames = Object.entries(comps).reduce(
      (accumulator, [comp, outcome]) => (accumulator += outcome.total),
      0
    );

    return Object.entries(comps).map(([comp, outcome]) => {
      return {
        comp: this.convertToFriendlyName(comp),
        ...outcome,
        winRate: Math.round((outcome.wins / outcome.total) * 100) / 100,
        frequency: Math.round((outcome.total / totalGames) * 100) / 100,
      };
    });
  }
}
