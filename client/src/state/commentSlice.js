import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { headers } from "../helper";

const initialState = {
  comments: [],
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    getAllCommentsReducer: (state, { payload }) => {
      if (payload.success) {
        state.comments = payload.data;
      }
    },
  },
});

export const getAllCommentsReducerAsync = (accessToken) => async (dispatch) => {
  try {
    const { data } = await axios.get("/comment", {
      headers: headers(accessToken),
    });

    if (data.data) {
      dispatch(getAllCommentsReducer(data));
    }
  } catch ({ response }) {
    if (response) {
      dispatch(getAllCommentsReducer(response.data));
    }
  }
};

export const selectComment = (state) => state.comment;
export const { getAllCommentsReducer } = commentSlice.actions;
export default commentSlice.reducer;
