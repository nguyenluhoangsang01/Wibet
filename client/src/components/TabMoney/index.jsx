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

const TabMoney = () => {
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
        "/setting/money",
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
      if (data.name === "defaultMoney") {
        form.current.setFields([
          {
            name: "defaultMoney",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsMoney"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      {/* Default money */}
      <Form.Item
        label="Default money"
        name="defaultMoney"
        rules={[
          {
            required: true,
            message: "Default money can not be blank",
          },
          {
            type: "number",
            message: "Default money is not a valid number",
          },
          {
            type: "number",
            min: 0,
            message: "Default money must be greater than or equal to 0",
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

export default TabMoney;
