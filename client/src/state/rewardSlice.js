import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  rewards: [],
};

export const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    getAllRewardsReducer: (state, { payload }) => {
      if (payload.success) {
        state.rewards = payload.data;
      }
    },
  },
});

export const getAllRewardsReducerAsync = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/reward");

    if (data) {
      dispatch(getAllRewardsReducer(data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllRewardsReducer(response.data));
    }
  }
};

export const selectReward = (state) => state.reward;
export const { getAllRewardsReducer } = rewardSlice.actions;
export default rewardSlice.reducer;
