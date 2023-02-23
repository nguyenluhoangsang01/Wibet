import { combineReducers, configureStore } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
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
import createTransform from "redux-persist/es/createTransform";
import storage from "redux-persist/lib/storage";
import { REACT_TRANSFORM_SECRET_KEY } from "../constants";
import accessLevelReducer from "../state/accessLevelSlice";
import betReducer from "../state/betSlice";
import commentReducer from "../state/commentSlice";
import matchReducer from "../state/matchSlice";
import rewardReducer from "../state/rewardSlice";
import settingReducer from "../state/settingSlice";
import teamReducer from "../state/teamSlice";
import userReducer from "../state/userSlice";

const encrypt = createTransform(
  (inboundState) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(
      JSON.stringify(inboundState),
      REACT_TRANSFORM_SECRET_KEY
    );

    return cryptedText.toString();
  },
  (outboundState) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(
      outboundState,
      REACT_TRANSFORM_SECRET_KEY
    );
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  }
);

const rootPersistConfig = {
  key: "root",
  storage,
  transforms: [encrypt],
};
const userPersistConfig = {
  key: "user",
  storage,
  transforms: [encrypt],
};
const teamPersistConfig = {
  key: "team",
  storage,
  transforms: [encrypt],
};
const matchPersistConfig = {
  key: "match",
  storage,
  transforms: [encrypt],
};
const betPersistConfig = {
  key: "bet",
  storage,
  transforms: [encrypt],
};
const commentPersistConfig = {
  key: "comment",
  storage,
  transforms: [encrypt],
};
const settingPersistConfig = {
  key: "setting",
  storage,
  transforms: [encrypt],
};
const rewardPersistConfig = {
  key: "reward",
  storage,
  transforms: [encrypt],
};
const accessLevelPersistConfig = {
  key: "accessLevel",
  storage,
  transforms: [encrypt],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  team: persistReducer(teamPersistConfig, teamReducer),
  match: persistReducer(matchPersistConfig, matchReducer),
  bet: persistReducer(betPersistConfig, betReducer),
  comment: persistReducer(commentPersistConfig, commentReducer),
  setting: persistReducer(settingPersistConfig, settingReducer),
  reward: persistReducer(rewardPersistConfig, rewardReducer),
  accessLevel: persistReducer(accessLevelPersistConfig, accessLevelReducer),
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
