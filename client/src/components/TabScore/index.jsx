import { Button, Form, InputNumber } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { headers } from "../../helper";
import {
  getTheLastSettingReducerAsync,
  selectSetting,
} from "../../state/settingSlice";
import { selectUser } from "../../state/userSlice";

const TabScore = () => {
  // Initial form ref
  const form = useRef(null);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Get access token from global state
  const { accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Handle update Rate settings
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        "/setting/score",
        { ...values },
        { headers: headers(accessToken) }
      );

      if (data) {
        dispatch(getTheLastSettingReducerAsync());

        // Then set is finish to false
        setIsFinish(false);

        // Send success notification
        toast.success(data.message);
      }
    } catch ({ response: { data } }) {
      if (data.name === "maxScore") {
        form.current.setFields([
          {
            name: "maxScore",
            errors: [data.message],
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
        ]);
      } else if (data.name === "timeUpdateScore") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsScore"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      {/* Max score input */}
      <Form.Item
        label="Max score"
        name="maxScore"
        rules={[
          {
            required: true,
            message: "Max score can not be blank",
          },
          {
            type: "number",
            message: "Max score is not a valid number",
          },
          {
            type: "number",
            min: 0,
            message: "Max score must be greater than or equal to 0",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      {/* Time to update score */}
      <Form.Item
        label="Time to update score (m)"
        name="timeUpdateScore"
        rules={[
          {
            required: true,
            message: "Time to update score can not be blank",
          },
          {
            type: "number",
            message: "Time to update score is not a valid number",
          },
          {
            type: "number",
            min: 0,
            message: "Time to update score must be greater than or equal to 0",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      {/* Update button */}
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button
          type="primary"
          htmlType="submit"
          className="bg-black flex items-center gap-2"
          disabled={isFinish}
        >
          {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
          <span>Update</span>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TabScore;
