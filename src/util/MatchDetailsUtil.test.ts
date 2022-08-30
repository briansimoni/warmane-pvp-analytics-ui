import {
  ClassMatchHistory,
  removeFriendlies,
  WowClass,
} from "./MatchDetailsUtil";
import { testData } from "./TestData";

describe("testing match details", () => {
  test("actually removes friendlies", () => {
    const dataWithNoFriendlies = removeFriendlies(testData);

    dataWithNoFriendlies.forEach((match) => {
      const { character_details } = match;
      expect(character_details).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({
            charname: "Dumpster",
          }),
        ])
      );
    });
  });

  test("MatchDetails class can filter by enemy class wins/losses", () => {
    const matchHistoryChecker = new ClassMatchHistory(testData);
    const [wins, losses] = matchHistoryChecker.getOverallClassHistory(
      WowClass.WARLOCK
    );
    expect(wins.length).toBeGreaterThanOrEqual(1);
    expect(losses.length).toBeGreaterThan(1);
  });

  test("Solo queue comps", () => {
    const matchHistoryChecker = new ClassMatchHistory(testData);
    const sqComps = matchHistoryChecker.getUniqueSoloQueueComps();
    expect(sqComps.length).toBeGreaterThan(10);
  });

  test("Solo top 10 wins", () => {
    const matchHistoryChecker = new ClassMatchHistory(testData);
    const top10 = matchHistoryChecker.getTop10SqComp("Loss");
    console.log(top10);
  });
});

export {};
