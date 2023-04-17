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
  character: string;
  realm: string;
  status: CrawlStatus;
  crawlFinished: boolean;
  error: SerializedError;
}

const initialState: CrawlState = {
  character: "",
  realm: "",
  status: CrawlStatus.IDLE,
  crawlFinished: false,
  error: {},
};

interface ApiThunkParams {
  character: string;
  realm: string;
}

/**
 * This function will attempt to start a crawl and then update state
 * upon completion. It is up to the caller to determine if initiating
 * a crawl for a particular character is allowed
 */
export const crawl = createAsyncThunk(
  "crawl",
  async (params: ApiThunkParams) => {
    const response = await waitForCrawlToComplete(
      params.character,
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
      .addCase(crawl.pending, (state) => {
        state.crawlFinished = false;
        state.status = CrawlStatus.LOADING;
      })
      .addCase(crawl.fulfilled, (state, action) => {
        state.status = CrawlStatus.IDLE;
        state.character = action.meta.arg.character;
        state.realm = action.meta.arg.realm;
        state.crawlFinished = true;
      })
      .addCase(crawl.rejected, (state, action) => {
        state.error = action.error;
        state.status = CrawlStatus.FAILED;
      });
  },
});

export const selectCrawlResult = (state: RootState) => state.crawl;

export default searchSlice.reducer;
