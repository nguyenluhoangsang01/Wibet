import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

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

    createTeamReducer: (state, { payload }) => {
      if (payload.success) {
        state.teams = payload.data;

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },

    updateTeamReducer: (state, { payload }) => {},

    deleteTeamReducer: (state, { payload }) => {
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

export const updateTeamReducerAsync = (_id, values) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("fullName", values.fullName);
    formData.append("image", values.image);

    const res = await axios.patch(`/team/${_id}`, formData, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
      "Content-Type": "multipart/form-data",
    });

    if (res.data) {
      dispatch(updateTeamReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(updateTeamReducer(response.data));
    }
  }
};

export const deleteTeamReducerAsync = (_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/team/${_id}`, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(deleteTeamReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(deleteTeamReducer(response.data));
    }
  }
};

export const selectTeam = (state) => state.team;
export const {
  getAllTeamsReducer,
  createTeamReducer,
  updateTeamReducer,
  deleteTeamReducer,
} = teamSlice.actions;
export default teamSlice.reducer;
