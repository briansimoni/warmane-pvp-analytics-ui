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
}
