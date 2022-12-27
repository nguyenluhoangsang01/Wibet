import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import matchReducer from "../state/matchSlice";
import teamReducer from "../state/teamSlice";
import userReducer from "../state/userSlice";

const rootPersistConfig = {
  key: "root",
  storage,
};
const userPersistConfig = {
  key: "user",
  storage,
};
const teamPersistConfig = {
  key: "team",
  storage,
};
const matchPersistConfig = {
  key: "match",
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  team: persistReducer(teamPersistConfig, teamReducer),
  match: persistReducer(matchPersistConfig, matchReducer),
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          FLUSH,
          PAUSE,
          PERSIST,
          persistStore,
          PURGE,
          REGISTER,
          REHYDRATE,
        ],
      },
    }),
});

export const persistor = persistStore(store);
