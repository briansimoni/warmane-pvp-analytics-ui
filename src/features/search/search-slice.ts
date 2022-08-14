import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  crawl,
  getMatchData,
  MatchDetails,
  pollCrawlStatus,
} from "../../api/warmane-analytics";
import { RootState } from "../../app/store";

export enum Status {
  IDLE,
  LOADING,
  FAILED,
}

export interface SearchState {
  charachter: string;
  realm: string;
  matches: MatchDetails[];
  status: Status;
  crawlStatus: Status;
}

interface ApiThunkParams {
  charachter: string;
  realm: string;
}

const initialState: SearchState = {
  charachter: "",
  realm: "",
  matches: [],
  status: Status.IDLE,
  crawlStatus: Status.IDLE,
};

export const getMatchHistory = createAsyncThunk(
  "search/getMatchHistory",
  async (params: ApiThunkParams) => {
    const response = await getMatchData(params.charachter, params.realm);
    return response;
  }
);

export const crawlAndPoll = createAsyncThunk(
  "search/crawl",
  async (params: ApiThunkParams) => {
    await crawl(params.charachter, params.realm);
    await pollCrawlStatus(params.charachter, params.realm);
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMatchHistory.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(getMatchHistory.fulfilled, (state, action) => {
        state.status = Status.IDLE;
        state.charachter = action.meta.arg.charachter;
        state.realm = action.meta.arg.realm;
        state.matches = action.payload;
      })
      .addCase(getMatchHistory.rejected, (state) => {
        state.status = Status.FAILED;
      })
      .addCase(crawlAndPoll.pending, (state) => {
        state.crawlStatus = Status.LOADING;
      })
      .addCase(crawlAndPoll.fulfilled, (state) => {
        state.crawlStatus = Status.IDLE;
      })
      .addCase(crawlAndPoll.rejected, (state) => {
        state.crawlStatus = Status.FAILED;
      });
  },
});

export const selectSearchResult = (state: RootState) => state.search;

export default searchSlice.reducer;
