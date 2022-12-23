import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  accessToken: null,
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginReducer: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;

      console.log(payload);
    },

    logoutReducer: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("persist:user");
    },
  },
});

export const loginReducerAsync = (values) => async (dispatch) => {
  try {
    const res = await axios.post("/user/login", values);

    if (res.data.data) {
      dispatch(loginReducer(res.data.data));
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const logoutReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get("/user/logout", {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(logoutReducer());
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const selectUser = (state) => state.user;
export const { loginReducer, logoutReducer } = userSlice.actions;
export default userSlice.reducer;
