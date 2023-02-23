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

const TabBank = () => {
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
        "/setting/bank",
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
      if (data.name === "nameOfBank") {
        form.current.setFields([
          {
            name: "nameOfBank",
            errors: [data.message],
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
        ]);
      } else if (data.name === "stkOfBank") {
        form.current.setFields([
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: [data.message],
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
        ]);
      } else if (data.name === "bank") {
        form.current.setFields([
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: [data.message],
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
        ]);
      } else if (data.name === "contentOfBank") {
        form.current.setFields([
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: [data.message],
          },
          {
            name: "noteOfBank",
            errors: null,
          },
        ]);
      } else if (data.name === "noteOfBank") {
        form.current.setFields([
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsBank"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      {/* Name of bank */}
      <Form.Item
        label="Name of bank"
        name="nameOfBank"
        rules={[
          {
            required: true,
            message: "Name of bank can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Bank account number */}
      <Form.Item
        label="Bank account number"
        name="stkOfBank"
        rules={[
          {
            required: true,
            message: "Bank account number can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Bank */}
      <Form.Item
        label="Bank"
        name="bank"
        rules={[
          {
            required: true,
            message: "Bank can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* Transfer content of bank */}
      <Form.Item
        label="Transfer content of bank"
        name="contentOfBank"
        rules={[
          {
            required: true,
            message: "Transfer content of bank can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Note of bank */}
      <Form.Item
        label="Note of bank"
        name="noteOfBank"
        rules={[
          {
            required: true,
            message: "Note of bank can not be blank",
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

export default TabBank;
