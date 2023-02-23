import { Button, Form, Input } from "antd";
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

const TabSkype = () => {
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
        "/setting/skype",
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
      if (data.name === "skypeName") {
        form.current.setFields([
          {
            name: "skypeName",
            errors: [data.message],
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "skypeLink") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsSkype"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        label="Skype name"
        name="skypeName"
        rules={[
          {
            required: true,
            message: "Skype name can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Skype link"
        name="skypeLink"
        rules={[
          {
            required: true,
            message: "Skype link can not be blank",
          },
        ]}
      >
        <Input />
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

export default TabSkype;
