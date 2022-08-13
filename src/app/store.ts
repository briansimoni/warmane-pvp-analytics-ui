// setting up a store is a onetime thing
// configureStore is a wrapper around the basic create store
// takes the reducer and makes a store but it creates it with the right defaults
// it auto enables the redux dev tools
// automatically create the func middleware
// turns on some development checks
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../features/search/search-slice";

// redux has tbe ability to mash a bunch of reducers together
// however reduxtoolkit can do it automaticlly for us
export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
