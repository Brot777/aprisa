import { configureStore } from "@reduxjs/toolkit";

/* QUERY */
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { api } from "../state/api";

/* REDUX */
import globalReducer from "../state/index";


export const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware
    ),
});

setupListeners(store.dispatch);