import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  accessLevel: [],
};

export const accessLevelSlice = createSlice({
  name: "accessLevel",
  initialState,
  reducers: {
    getAllAccessLevelReducer: (state, { payload }) => {
      if (payload.success) {
        state.accessLevel = payload.data;
      }
    },
  },
});

export const getAllAccessLevelReducerAsync = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/accessLevel");

    if (data) {
      dispatch(getAllAccessLevelReducer(data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllAccessLevelReducer(response.data));
    }
  }
};

export const selectAccessLevel = (state) => state.accessLevel;
export const { getAllAccessLevelReducer } = accessLevelSlice.actions;
export default accessLevelSlice.reducer;
