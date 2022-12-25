import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

    createTeamReducer: (state, { payload }) => {},

    updateTeamReducer: (state, { payload }) => {},

    deleteTeamReducer: (state, { payload }) => {},
  },
});

export const getAllTeamsReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get(`/team`, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(getAllTeamsReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllTeamsReducer(response.data));
    }
  }
};

export const createTeamReducerAsync = () => async (dispatch) => {};

export const updateTeamReducerAsync = () => async (dispatch) => {};

export const deleteTeamReducerAsync = () => async (dispatch) => {};

export const selectTeam = (state) => state.team;
export const {
  getAllTeamsReducer,
  createTeamReducer,
  updateTeamReducer,
  deleteTeamReducer,
} = teamSlice.actions;
export default teamSlice.reducer;
