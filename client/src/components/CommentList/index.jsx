import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsFillTrashFill } from "react-icons/bs";
import { GiTimeBomb } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { formatTime, headers } from "../../helper";
import { getAllCommentsReducerAsync } from "../../state/commentSlice";
import { selectUser } from "../../state/userSlice";
import ModalDeleteComment from "../ModalDeleteComment";

const CommentList = ({ comments, isShowAllComments }) => {
  // Initial state
  const maximumContent = 5;
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);

  // Handle delete
  const handleDelete = async (id) => {
    // Open modal
    setOpen(true);

    // Set id of comment selected
    setSelectedComment(id);
  };

  // Handle cancel
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading first
    setConfirmLoading(true);

    try {
      // Delete comment
      const res = await axios.delete(`/comment/${selectedComment}`, {
        headers: headers(accessToken),
      });

      if (res.data) {
        dispatch(getAllCommentsReducerAsync(accessToken));

        // Set loading to false after delete
        setConfirmLoading(false);

        // Send success notification
        toast.success(res.data.message);

        // After delete close modal
        setOpen(false);
      }
    } catch ({ response }) {
      if (response.data) {
        // Set loading to false after have error
        setConfirmLoading(false);

        // Send error notification
        toast.error(response.data.message);
      }
    }
  };

  return (
    <ul className="flex flex-col gap-6">
      {comments.length > maximumContent && !isShowAllComments
        ? comments.slice(0, maximumContent).map((comment) => (
            <li key={comment._id} className="flex gap-4 relative">
              {/* Avatar */}
              <div className="bg-[#428bca] w-[60px] h-[60px] flex items-center justify-center rounded-[20px] select-none">
                <span className="text-white uppercase text-[36px] font-semibold">
                  {comment.user.fullName.slice(0, 1)}
                </span>
              </div>

              {/* Content */}
              <div>
                <span className="font-bold text-[#428bca] text-[18px]">
                  {comment.user.fullName}
                </span>

                <p className="flex items-center gap-2 text-[#687a86] text-[12px]">
                  <span>
                    <GiTimeBomb />
                  </span>
                  <span>{formatTime(comment.createdAt)}</span>
                </p>

                <p className="mt-[10px]">{comment.content}</p>
              </div>

              {/* Options */}
              {(user?._id === comment.user._id || user?.roleID === "Admin") && (
                <button
                  className="absolute right-0 top-0 mt-2"
                  onClick={() => handleDelete(comment._id)}
                >
                  <BsFillTrashFill className="text-2xl text-[#656c7a] transition hover:text-[#d9534f]" />
                </button>
              )}
            </li>
          ))
        : comments.map((comment) => (
            <li key={comment._id} className="flex gap-4 relative">
              {/* Avatar */}
              <div className="bg-[#428bca] w-[60px] h-[60px] flex items-center justify-center rounded-[20px] select-none">
                <span className="text-white uppercase text-[36px] font-semibold">
                  {comment.user.fullName.slice(0, 1)}
                </span>
              </div>

              {/* Content */}
              <div>
                <span className="font-bold text-[#428bca] text-[18px]">
                  {comment.user.fullName}
                </span>

                <p className="flex items-center gap-2 text-[#687a86] text-[12px]">
                  <span>
                    <GiTimeBomb />
                  </span>
                  <span>{formatTime(comment.createdAt)}</span>
                </p>

                <p className="mt-[10px]">{comment.content}</p>
              </div>

              {/* Options */}
              <button
                className="absolute right-0 top-0 mt-2"
                onClick={() => handleDelete(comment._id)}
              >
                <BsFillTrashFill className="text-2xl text-[#656c7a] transition hover:text-[#d9534f]" />
              </button>
            </li>
          ))}

      {comments.length <= 0 && (
        <p className="text-center opacity-60 text-[15px] text-[#2a2e2e]">
          Be the first to comment.
        </p>
      )}

      {/* Delete comment modal */}
      <ModalDeleteComment
        open={open}
        confirmLoading={confirmLoading}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </ul>
  );
};

export default CommentList;
