import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { waitForCrawlToComplete } from "../../api/warmane-analytics";
import { RootState } from "../../app/store";

export enum CrawlStatus {
  IDLE,
  LOADING,
  FAILED,
}

export interface CrawlState {
  charachter: string;
  realm: string;
  status: CrawlStatus;
  crawlFinished: boolean;
  error: SerializedError;
}

const initialState: CrawlState = {
  charachter: "",
  realm: "",
  status: CrawlStatus.IDLE,
  crawlFinished: false,
  error: {},
};

interface ApiThunkParams {
  charachter: string;
  realm: string;
}

/**
 * This function will attempt to start a crawl and then update state
 * upon completion. It is up to the caller to determine if initiating
 * a crawl for a particular charachter is allowed
 */
export const crawlAndWait = createAsyncThunk(
  "crawl",
  async (params: ApiThunkParams) => {
    const response = await waitForCrawlToComplete(
      params.charachter,
      params.realm
    );
    return response;
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(crawlAndWait.pending, (state) => {
        state.crawlFinished = false;
        state.status = CrawlStatus.LOADING;
      })
      .addCase(crawlAndWait.fulfilled, (state, action) => {
        state.status = CrawlStatus.IDLE;
        state.charachter = action.meta.arg.charachter;
        state.realm = action.meta.arg.realm;
        state.crawlFinished = true;
      })
      .addCase(crawlAndWait.rejected, (state, action) => {
        state.error = action.error;
        state.status = CrawlStatus.FAILED;
      });
  },
});

export const selectCrawlResult = (state: RootState) => state.crawl;

export default searchSlice.reducer;
