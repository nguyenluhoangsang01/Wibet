import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  matches: [],
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    getAllMatchesReducer: (state, { payload }) => {
      if (payload.success) {
        state.matches = payload.data;
      }
    },
  },
});

export const getAllMatchesReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get("/match", {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(getAllMatchesReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllMatchesReducer(response.data));
    }
  }
};

export const selectMatch = (state) => state.match;
export const { getAllMatchesReducer } = matchSlice.actions;
export default matchSlice.reducer;
