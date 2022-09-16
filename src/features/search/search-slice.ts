import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMatchData, MatchDetails } from "../../api/warmane-analytics";
import { RootState } from "../../app/store";

export enum SearchStatus {
  IDLE,
  LOADING,
  FAILED,
}

export interface SearchState {
  charachter: string;
  realm: string;
  matches: MatchDetails[];
  status: SearchStatus;
}

interface ApiThunkParams {
  charachter: string;
  realm: string;
}

const initialState: SearchState = {
  charachter: "",
  realm: "",
  matches: [],
  status: SearchStatus.IDLE,
};

export const getMatchHistory = createAsyncThunk(
  "search/getMatchHistory",
  async (params: ApiThunkParams) => {
    const response = await getMatchData(params.charachter, params.realm);
    return response;
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearMatchHistory: (state) => {
      state.matches = [];
      state.charachter = "";
      state.realm = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMatchHistory.pending, (state) => {
        state.status = SearchStatus.LOADING;
      })
      .addCase(getMatchHistory.fulfilled, (state, action) => {
        state.status = SearchStatus.IDLE;
        state.charachter = action.meta.arg.charachter;
        state.realm = action.meta.arg.realm;
        if (action.payload) {
          state.matches = action.payload;
        }
      })
      .addCase(getMatchHistory.rejected, (state) => {
        state.status = SearchStatus.FAILED;
      });
  },
});

export const selectSearchResult = (state: RootState) => state.search;
export const { clearMatchHistory } = searchSlice.actions;
export default searchSlice.reducer;
