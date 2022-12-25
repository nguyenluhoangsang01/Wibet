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

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  team: persistReducer(teamPersistConfig, teamReducer),
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
