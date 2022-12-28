import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { headers } from "../constants";

const initialState = {
  teams: [],
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    getAllTeamsReducer: (state, { payload }) => {
      if (payload.success) {
        state.teams = payload.data;
      }
    },

    updateTeamReducer: (state, { payload }) => {
      if (payload.success) {
        state.teams = payload.data;

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },
  },
});

export const getAllTeamsReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get(`/team`, { headers });

    if (res.data) {
      dispatch(getAllTeamsReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllTeamsReducer(response.data));
    }
  }
};

export const deleteTeamReducerAsync = (_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/team/${_id}`, { headers });

    if (res.data) {
      dispatch(updateTeamReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(updateTeamReducer(response.data));
    }
  }
};

export const selectTeam = (state) => state.team;
export const { getAllTeamsReducer, updateTeamReducer } = teamSlice.actions;
export default teamSlice.reducer;
