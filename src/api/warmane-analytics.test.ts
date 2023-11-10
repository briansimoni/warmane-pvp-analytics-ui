import dayjs from "dayjs";
import { crawledInLast24Hours } from "./warmane-analytics";

describe("warmane analytics api tests", () => {
  test("crawledInLast24Hours should work", () => {
    const lastCrawledMonthAgo = dayjs().subtract(1, "month").toISOString();
    expect(crawledInLast24Hours(lastCrawledMonthAgo)).toBe(false);

    const lastCrawledHourAgo = dayjs().subtract(1, "hour").toISOString();
    expect(crawledInLast24Hours(lastCrawledHourAgo)).toBe(true);
  });
});
