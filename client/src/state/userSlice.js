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
    },

    logoutReducer: (state) => {
      state.accessToken = null;
      state.user = null;
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
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2EyNjk2YzI4ZjdiMmM0MjI2NzA2YjMiLCJpYXQiOjE2NzE3Njg0NjcsImV4cCI6MTY3MTg1NDg2N30.yyAt71iIDU9aDNwqMcx96F6O6ahpb5JQdZBNs9hkmfU",
      },
    });

    console.log(res);
  } catch (error) {
    console.log(error.message);
  }
};

export const selectUser = (state) => state.user;
export const { loginReducer } = userSlice.actions;
export default userSlice.reducer;
