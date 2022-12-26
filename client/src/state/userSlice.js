import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  accessToken: null,
  user: null,
  users: [],
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
      } else {
        state.accessToken = null;
        state.user = null;

        toast.error(payload.message);
      }
    },

    logoutReducer: (state, { payload }) => {
      if (payload.success) {
        state.accessToken = null;
        state.user = null;
        localStorage.removeItem("persist:user");

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },

    getAllUsersReducer: (state, { payload }) => {
      if (payload.success) {
        state.users = payload.data;
      }
    },

    updatePasswordReducer: (state, { payload }) => {
      if (payload.success) {
        state.user = payload.data.user;

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },

    deleteUserReducer: (state, { payload }) => {
      if (payload.success) {
        state.users = payload.data.users;

        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },

    updateUserByIdReducer: (state, { payload }) => {
      if (payload.success) {
        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
    },
  },
});

export const loginReducerAsync = (values) => async (dispatch) => {
  try {
    const res = await axios.post("/user/login", values);

    if (res.data) {
      dispatch(loginReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(loginReducer(response.data));
    }
  }
};

export const logoutReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get("/user/logout", {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(logoutReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(logoutReducer(response.data));
    }
  }
};

export const getAllUsersReducerAsync = () => async (dispatch) => {
  try {
    const res = await axios.get("/user", {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(getAllUsersReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(getAllUsersReducer(response.data));
    }
  }
};

export const updatePasswordReducerAsync = (values) => async (dispatch) => {
  try {
    const res = await axios.patch("/user/update/password", values, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(updatePasswordReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(updatePasswordReducer(response.data));
    }
  }
};

export const deleteUserReducerAsync = (_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/user/${_id}`, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
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

export const updateUserByIdReducerAsync = (_id, values) => async (dispatch) => {
  try {
    const res = await axios.patch(`/user/${_id}`, values, {
      headers: {
        authorization: `Bearer ${JSON.parse(
          localStorage.getItem("persist:user")
        )?.accessToken?.replaceAll('"', "")}`,
      },
    });

    if (res.data) {
      dispatch(updateUserByIdReducer(res.data));
    }
  } catch ({ response }) {
    if (response.data) {
      dispatch(updateUserByIdReducer(response.data));
    }
  }
};

export const selectUser = (state) => state.user;
export const {
  loginReducer,
  logoutReducer,
  getAllUsersReducer,
  updatePasswordReducer,
  deleteUserReducer,
  updateUserByIdReducer,
} = userSlice.actions;
export default userSlice.reducer;
