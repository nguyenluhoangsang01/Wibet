import { Image } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CommentList from "../../components/CommentList";
import Editor from "../../components/Editor";
import { capitalize } from "../../helper";
import { getAllCommentsReducer, selectComment } from "../../state/commentSlice";
import { selectUser } from "../../state/userSlice";

const Comments = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial dispatch
  const dispatch = useDispatch();
  // Get comments from global state
  const { comments } = useSelector(selectComment);
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [isShowAllComments, setIsShowAllComments] = useState(false);
  const [isShow, setIsShow] = useState(false);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all comments
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/comment");

        if (data.data) {
          dispatch(getAllCommentsReducer(data));

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response) {
          dispatch(getAllCommentsReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  if (!isShow) return <span>Loading...</span>;

  // Handle login
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="font-[calibri] divide-y-2 min-h-[calc(100vh-50px-60px-40px)]">
      <div className="w-full pb-10">
        <div className="flex flex-col items-center justify-center mt-[70px]">
          <a
            href="https://join.skype.com/tMRrQSXDthKA"
            target="_blank"
            rel="noreferrer"
          >
            <div className="w-[400px] h-[400px] border-[#fefefefe] border-[5px] rounded-[50%] relative overflow-hidden image-cropper flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/wibet/image/upload/v1673334368/cup_t2bnfy.jpg"
                alt="profile"
                preview={false}
                className="!w-[800px] !h-[400px] my-0 mx-auto inline object-cover"
              />
            </div>
          </a>
          <div>
            <a
              href="https://join.skype.com/tMRrQSXDthKA"
              target="_blank"
              rel="noreferrer"
              className="text-[#428bca] font-bold font-[arial] text-[36px] w-[350px] text-center inline-block leading-none transition hover:underline hover:text-[#2a6496] mt-[20px] mb-[10px]"
            >
              Join with us via skype!
            </a>
          </div>
        </div>

        <div className="w-full flex items-center justify-between text-[#343434] py-[12px] font-bold relative">
          <span className="text-[18px]">
            {comments.length} <span className="font-normal">comment</span>
            {comments.length > 1 ? <span className="font-normal">s</span> : ""}
          </span>
          {!user && (
            <button
              className="text-[20px] text-[#656c7a] flex items-center gap-2"
              onClick={handleLogin}
            >
              Login
              <AiOutlineLogin />
            </button>
          )}
        </div>

        <Editor />

        <CommentList
          comments={[...comments?.comments].reverse()}
          isShowAllComments={isShowAllComments}
        />
      </div>

      {comments.length > 5 && (
        <div className="w-full flex justify-center pt-6">
          <button
            onClick={() => setIsShowAllComments((e) => !e)}
            className="pt-[8px] pr-[10px] pb-[5px] pl-[9px] bg-[#333] text-[#fff] cursor-pointer text-[14px] select-none rounded-md font-[calibri] hover:scale-105 active:scale-100 transition"
          >
            {isShowAllComments ? "See less" : "See more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
