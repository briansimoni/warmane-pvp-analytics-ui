import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMatchData, MatchDetails } from "../../api/warmane-analytics";
import { RootState } from "../../app/store";

export enum SearchStatus {
  IDLE,
  LOADING,
  FAILED,
}

export interface SearchState {
  character: string;
  realm: string;
  matches: MatchDetails[];
  status: SearchStatus;
}

interface ApiThunkParams {
  character: string;
  realm: string;
}

const initialState: SearchState = {
  character: "",
  realm: "",
  matches: [],
  status: SearchStatus.IDLE,
};

export const getMatchHistory = createAsyncThunk(
  "search/getMatchHistory",
  async (params: ApiThunkParams) => {
    const response = await getMatchData(params.character, params.realm);
    return response;
  }
);

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearMatchHistory: (state) => {
      state.matches = [];
      state.character = "";
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
        state.character = action.meta.arg.character;
        state.realm = action.meta.arg.realm;
        if (action.payload && action.payload.data) {
          state.matches = action.payload.data.matches;
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
