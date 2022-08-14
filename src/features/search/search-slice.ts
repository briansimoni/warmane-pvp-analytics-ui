import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doItAll, MatchDetails } from "../../api/warmane-analytics";
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

/**
 * Beware that this will "Do it all"
 * it will crawl for new data if the last crawl took
 * place more than 24 hours ago. This means it may take a long time.
 */
export const getMatchHistory = createAsyncThunk(
  "search/getMatchHistory",
  async (params: ApiThunkParams) => {
    const response = await doItAll(params.charachter, params.realm);
    console.log("thunk response", response);
    return response;
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
        console.log(action);
        if (action.payload) {
          state.matches = action.payload;
        }
      })
      .addCase(getMatchHistory.rejected, (state) => {
        state.status = Status.FAILED;
      });
  },
});

export const selectSearchResult = (state: RootState) => state.search;

export default searchSlice.reducer;
