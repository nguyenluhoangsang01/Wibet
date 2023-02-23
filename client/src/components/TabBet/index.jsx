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

const TabBet = () => {
  // Initial form ref
  const form = useRef(null);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  // Get access token from global state
  const { accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Handle update Bet settings
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        "/setting/bet",
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
      if (data.name === "minBetMoney") {
        form.current.setFields([
          {
            name: "minBetMoney",
            errors: [data.message],
          },
          {
            name: "timeBet",
            errors: null,
          },
        ]);
      } else if (data.name === "timeBet") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "timeBet",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsBet"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      {/* Min bet money input */}
      <Form.Item
        label="Min bet money"
        name="minBetMoney"
        rules={[
          {
            required: true,
            message: "Min bet money can not be blank",
          },
          {
            type: "number",
            message: "Min bet money is not a valid number",
          },
          {
            type: "number",
            min: 1,
            message: "Min bet must be greater than or equal to 1",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      {/* Time to bet */}
      <Form.Item
        label="Time to bet (m)"
        name="timeBet"
        rules={[
          {
            required: true,
            message: "Time to bet can not be blank",
          },
          {
            type: "number",
            message: "Time to bet is not a valid number",
          },
          {
            type: "number",
            min: 0,
            message: "Time to bet must be greater than or equal to 0",
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

export default TabBet;
