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
  errorMessage?: string;
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
    if (response.length === 0) {
      throw new Error(
        `${params.character} on ${params.realm} has not played any games this season`
      );
    }
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
        if (action.payload) {
          state.matches = action.payload;
        }
      })
      .addCase(getMatchHistory.rejected, (state, payloadAction) => {
        state.status = SearchStatus.FAILED;
        state.errorMessage = payloadAction.error.message;
      });
  },
});

export const selectSearchResult = (state: RootState) => state.search;
export const { clearMatchHistory } = searchSlice.actions;
export default searchSlice.reducer;
