import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMatchData, MatchDetails } from "../../api/warmane-analytics";
import { RootState } from "../../app/store";

export enum SearchStatus {
  IDLE,
  LOADING,
  FAILED,
}

export interface MatchData {
  charachter?: string;
  realm?: string;
  matches: MatchDetails[];
}

export interface SearchState {
  value: MatchData;
  status: SearchStatus;
}

interface GetMatchDataThunkParams {
  charachter: string;
  realm: string;
}

const initialState: SearchState = {
  value: {
    matches: [],
  },
  status: SearchStatus.IDLE,
};

export const getMatchHistory = createAsyncThunk(
  "search/getMatchHistory",
  async (params: GetMatchDataThunkParams) => {
    const response = await getMatchData(params.charachter, params.realm);
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
        state.status = SearchStatus.LOADING;
      })
      .addCase(getMatchHistory.fulfilled, (state, action) => {
        state.status = SearchStatus.IDLE;
        state.value.matches = action.payload;
      })
      .addCase(getMatchHistory.rejected, (state) => {
        state.status = SearchStatus.FAILED;
      });
  },
});

export const selectSearchResult = (state: RootState) => state.search;

export default searchSlice.reducer;
