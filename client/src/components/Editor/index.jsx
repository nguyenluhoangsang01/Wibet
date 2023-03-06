import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { memo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { headers } from "../../helper";
import { getAllCommentsReducerAsync } from "../../state/commentSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Editor = () => {
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial form ref
  const form = useRef(null);

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click comment button
    setIsFinish(true);

    try {
      // Create new comment
      const res = await axios.post(
        `/comment`,
        { ...values },
        { headers: headers(accessToken) }
      );

      if (res.data) {
        dispatch(getAllCommentsReducerAsync());

        // Reset form
        form.current.resetFields();

        // Set is finish to false
        setIsFinish(false);

        toast.success(res.data.message);
      }
    } catch ({ response: { data } }) {
      // Set is finish to false
      setIsFinish(false);

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

  return (
    <Form
      className="flex items-center gap-2 mb-8 md:flex-row md:items-start"
      name="editor"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ content: "" }}
      ref={form}
    >
      {/* Avatar */}
      <div className="bg-[#428bca] min-w-[60px] min-h-[60px] items-center justify-center rounded-[20px] select-none hidden md:flex">
        <span className="text-white uppercase text-[36px] font-semibold">
          {user?.username?.slice(0, 1)}
        </span>
      </div>

      <div className="w-full">
        {/* Editor */}
        <Form.Item
          name="content"
          className="w-full"
          rules={[
            {
              required: true,
              message: "Content can not be blank",
            },
          ]}
        >
          <TextArea
            rows={4}
            className="w-full text-[15px] pl-4 pt-2"
            placeholder="Start the discussion..."
            disabled={!user}
          />
        </Form.Item>

        {/* Comment button */}
        <Form.Item className="flex justify-end -mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
            disabled={!user || isFinish}
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Comment</span>
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default memo(Editor);
