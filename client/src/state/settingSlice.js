import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { headers } from "../helper";

const initialState = {
  settings: {},
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    updateSettingReducer: (state, { payload }) => {
      if (payload.success) {
        state.settings = payload.data;
      }
    },
  },
});

export const getTheLastSettingReducerAsync =
  (accessToken) => async (dispatch) => {
    try {
      const res = await axios.get("/setting", {
        headers: headers(accessToken),
      });

      if (res.data) {
        dispatch(updateSettingReducer(res.data));
      }
    } catch ({ response }) {
      if (response.data) {
        dispatch(updateSettingReducer(response.data));
      }
    }
  };

export const selectSetting = (state) => state.setting;
export const { updateSettingReducer } = settingSlice.actions;
export default settingSlice.reducer;
