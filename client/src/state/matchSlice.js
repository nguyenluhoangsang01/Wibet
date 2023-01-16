import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { headers } from "../helper";

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

    updateMatchReducer: (state, { payload }) => {
      if (payload.success) {
        state.matches = payload.data;

        toast.success(payload.message);
      }
    },
  },
});

export const getAllMatchesReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get("/match");

    if (res.data) {
      dispatch(getAllMatchesReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllMatchesReducer(response.data));
    }
  }
};

export const deleteMatchReducerAsync =
  (accessToken, _id) => async (dispatch) => {
    try {
      const res = await axios.delete(`/match/${_id}`, {
        headers: headers(accessToken),
      });

      if (res.data) {
        dispatch(updateMatchReducer(res.data));
      }
    } catch ({ response }) {
      if (response.data) {
        dispatch(updateMatchReducer(response.data));
      }
    }
  };

export const selectMatch = (state) => state.match;
export const { getAllMatchesReducer, updateMatchReducer } = matchSlice.actions;
export default matchSlice.reducer;
