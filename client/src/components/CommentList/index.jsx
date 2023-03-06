import axios from "axios";
import moment from "moment";
import React, { memo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import { GiTimeBomb } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../constants";
import { headers } from "../../helper";
import { getAllCommentsReducerAsync } from "../../state/commentSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";
import Modals from "../Modals";
import ModalUpdateComment from "../ModalUpdateComment";

const CommentList = ({ comments, isShowAllComments }) => {
  // Initial state
  const maximumContent = 5;
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedCommentUpdate, setSelectedCommentUpdate] = useState(null);
  const [contentEdit, setContentEdit] = useState("");
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial form ref
  const form = useRef(null);

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
        dispatch(getAllCommentsReducerAsync());

        // Set loading to false after delete
        setConfirmLoading(false);

        // Send success notification
        toast.success(res.data.message);

        // After delete close modal
        setOpen(false);
      }
    } catch ({ response: { data } }) {
      // Set loading to false after have error
      setConfirmLoading(false);

      // Check if name data equal content
      if (data.name === "content") {
        form.current.setFields([
          {
            name: "content",
            errors: [data.message],
          },
        ]);
      }

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }
    }
  };

  // Handle update
  const handleUpdate = (values) => {
    // Set true to open modal
    setOpenUpdate(true);

    // Set comment selected
    setSelectedCommentUpdate(values);
  };

  // Handle ok when update
  const handleOkUpdate = async () => {
    // Set loading state to true first
    setConfirmLoadingUpdate(true);

    try {
      // Update comment
      const { data } = await axios.patch(
        `/comment/${selectedCommentUpdate._id}`,
        { content: contentEdit },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (data) {
        // Dispatch get all comment reducer async action to get new data
        dispatch(getAllCommentsReducerAsync());

        // After finish set loading to false
        setConfirmLoadingUpdate(false);

        // Close modal when update success
        setOpenUpdate(false);

        // Reset form
        form.current.resetFields();
      }
    } catch ({ response }) {
      // Set is finish to false
      setConfirmLoadingUpdate(false);

      if (response?.data?.name === "content") {
        form.current.setFields([
          {
            name: "content",
            errors: [response?.data?.message],
          },
        ]);
      }

      if (response?.data?.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }
    }
  };

  // Handle cancel update
  const handleCancelUpdate = () => {
    setOpenUpdate(false);
  };

  return (
    <ul className="flex flex-col gap-6">
      {comments.length > maximumContent && !isShowAllComments
        ? comments.slice(0, maximumContent).map((comment) => (
            <li key={comment._id} className="flex gap-4 relative">
              {/* Avatar */}
              <div className="bg-[#428bca] min-w-[60px] h-[60px] flex items-center justify-center rounded-[20px] select-none">
                <span className="text-white uppercase text-[36px] font-semibold">
                  {comment?.user?.fullName.slice(0, 1)}
                </span>
              </div>

              {/* Content */}
              <div>
                <span className="font-bold text-[#428bca] text-[18px]">
                  {comment?.user?.fullName}
                </span>

                <p className="flex items-center gap-2 text-[#687a86] text-[12px]">
                  <span>
                    <GiTimeBomb />
                  </span>
                  <span>{moment(comment?.createdAt).format(formatTime)}</span>
                </p>

                <p className="mt-[10px]">{comment?.content}</p>
              </div>

              {/* Options */}
              {(user?._id === comment?.user?._id ||
                user?.roleID === "Admin") && (
                <>
                  <button
                    className="absolute right-[40px] top-0 mt-2"
                    onClick={() => handleUpdate(comment)}
                  >
                    <BsPencilFill className="text-2xl text-[#656c7a] transition hover:text-[#ffc107]" />
                  </button>

                  <button
                    className="absolute right-0 top-0 mt-2"
                    onClick={() => handleDelete(comment?._id)}
                  >
                    <BsFillTrashFill className="text-2xl text-[#656c7a] transition hover:text-[#d9534f]" />
                  </button>
                </>
              )}
            </li>
          ))
        : comments.map((comment) => (
            <li key={comment._id} className="flex gap-4 relative">
              {/* Avatar */}
              <div className="bg-[#428bca] min-w-[60px] h-[60px] flex items-center justify-center rounded-[20px] select-none">
                <span className="text-white uppercase text-[36px] font-semibold">
                  {comment?.user?.fullName.slice(0, 1)}
                </span>
              </div>

              {/* Content */}
              <div>
                <span className="font-bold text-[#428bca] text-[18px]">
                  {comment?.user?.fullName}
                </span>

                <p className="flex items-center gap-2 text-[#687a86] text-[12px]">
                  <span>
                    <GiTimeBomb />
                  </span>
                  <span>{moment(comment?.createdAt).format(formatTime)}</span>
                </p>

                <p className="mt-[10px]">{comment.content}</p>
              </div>

              {/* Options */}
              {(user?._id === comment?.user?._id ||
                user?.roleID === "Admin") && (
                <>
                  <button
                    className="absolute right-[40px] top-0 mt-2"
                    onClick={() => handleUpdate(comment)}
                  >
                    <BsPencilFill className="text-2xl text-[#656c7a] transition hover:text-[#ffc107]" />
                  </button>

                  <button
                    className="absolute right-0 top-0 mt-2"
                    onClick={() => handleDelete(comment?._id)}
                  >
                    <BsFillTrashFill className="text-2xl text-[#656c7a] transition hover:text-[#d9534f]" />
                  </button>
                </>
              )}
            </li>
          ))}

      {comments?.length <= 0 && (
        <p className="text-center opacity-60 text-[15px] text-[#2a2e2e]">
          Be the first to comment.
        </p>
      )}

      {/* Delete comment modal */}
      <Modals
        title="Delete comment"
        open={open}
        confirmLoading={confirmLoading}
        content="Are you sure you want to delete this comment?"
        handleOk={handleOk}
        handleCancel={handleCancel}
      />

      {/* Update comment modal */}
      <ModalUpdateComment
        openUpdate={openUpdate}
        confirmLoadingUpdate={confirmLoadingUpdate}
        handleOkUpdate={handleOkUpdate}
        handleCancelUpdate={handleCancelUpdate}
        user={user}
        setContentEdit={setContentEdit}
        selectedCommentUpdate={selectedCommentUpdate}
      />
    </ul>
  );
};

export default memo(CommentList);
