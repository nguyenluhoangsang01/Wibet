import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { headers } from "../helper";

const initialState = {
  bets: [],
};

export const betSlice = createSlice({
  name: "bet",
  initialState,
  reducers: {
    getAllBetsReducer: (state, { payload }) => {
      if (payload.success) {
        state.bets = payload.data;
      }
    },
  },
});

export const getAllBetsReducerAsync = (accessToken) => async (dispatch) => {
  try {
    const res = await axios.get("/bet", { headers: headers(accessToken) });

    if (res.data) {
      dispatch(getAllBetsReducer(res.data));
    }
  } catch ({ response }) {
    if (response) {
      dispatch(getAllBetsReducer(response.data));
    }
  }
};

export const selectBet = (state) => state.bet;
export const { getAllBetsReducer } = betSlice.actions;
export default betSlice.reducer;
