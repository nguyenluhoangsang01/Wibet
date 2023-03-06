import storage from "redux-persist/lib/storage";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { headers } from "../helper";

const initialState = {
  accessToken: null,
  user: null,
  users: [],
  isShowHistory: false,
  remember: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginReducer: (state, { payload }) => {
      if (payload.success) {
        state.accessToken = payload.data.accessToken;
        state.user = payload.data.user;

        toast.success(payload.message);
      }
    },

    logoutReducer: (state, { payload }) => {
      state.accessToken = null;
      state.user = null;

      if (payload.success) {
        toast.success(payload.message);
      }
    },

    getAllUsersReducer: (state, { payload }) => {
      if (payload.success) {
        state.users = payload.data;
      }
    },

    updateUserReducer: (state, { payload }) => {
      if (payload.success) {
        state.user = payload.data.user;

        toast.success(payload.message);
      }
    },

    updateProfileReducer: (state, { payload }) => {
      if (payload.success) {
        state.user = payload.data.user;
      }
    },

    updateUserAfterDeleteBet: (state, { payload }) => {
      if (payload.success) {
        state.user = payload.data;

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },

    deleteUserReducer: (state, { payload }) => {
      if (payload.success) {
        state.users = payload.data;

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },

    toggleIsShowHistory: (state) => {
      state.isShowHistory = !state.isShowHistory;
    },

    updateRememberToTrue: (state) => {
      state.remember = true;
    },

    updateRememberToFalse: (state) => {
      state.remember = false;
    },
  },
});

export const logoutReducerAsync = (accessToken) => async (dispatch) => {
  try {
    const res = await axios.get("/user/logout", {
      headers: headers(accessToken),
    });

    if (res.data) {
      dispatch(logoutReducer(res.data));

      storage.removeItem("persist:root");
      storage.removeItem("persist:user");
      storage.removeItem("persist:match");
      storage.removeItem("persist:bet");
      storage.removeItem("persist:team");
      storage.removeItem("persist:comment");
      storage.removeItem("persist:setting");
      storage.removeItem("persist:reward");
      storage.removeItem("persist:accessLevel");
      localStorage.removeItem("rememberMe");
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(logoutReducer(response.data));
    }
  }
};

export const getAllUsersReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get("/user");

    if (res.data) {
      dispatch(getAllUsersReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllUsersReducer(response.data));
    }
  }
};

export const deleteUserReducerAsync =
  (accessToken, _id) => async (dispatch) => {
    try {
      const res = await axios.delete(`/user/${_id}`, {
        headers: headers(accessToken),
      });

      if (res.data) {
        dispatch(deleteUserReducer(res.data));
      }
    } catch ({ response }) {
      if (response.data) {
        dispatch(deleteUserReducer(response.data));
      }
    }
  };

export const selectUser = (state) => state.user;
export const {
  loginReducer,
  logoutReducer,
  getAllUsersReducer,
  updateUserReducer,
  deleteUserReducer,
  updateUserAfterDeleteBet,
  toggleIsShowHistory,
  updateRememberToTrue,
  updateRememberToFalse,
  updateProfileReducer,
} = userSlice.actions;
export default userSlice.reducer;
