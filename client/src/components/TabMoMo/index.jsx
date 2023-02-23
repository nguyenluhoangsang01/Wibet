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

const TabMoMo = () => {
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
        "/setting/moMo",
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
      if (data.name === "numberOfMoMo") {
        form.current.setFields([
          {
            name: "numberOfMoMo",
            errors: [data.message],
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
        ]);
      } else if (data.name === "nameOfMoMo") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: [data.message],
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
        ]);
      } else if (data.name === "contentOfMoMo") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: [data.message],
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
        ]);
      } else if (data.name === "noteOfMoMo") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsMoMo"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item
        label="MoMo account number"
        name="numberOfMoMo"
        rules={[
          {
            required: true,
            message: "MoMo account number can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="MoMo account name"
        name="nameOfMoMo"
        rules={[
          {
            required: true,
            message: "MoMo account name can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Transfer content of MoMo"
        name="contentOfMoMo"
        rules={[
          {
            required: true,
            message: "Transfer content of MoMo can not be blank",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Note of MoMo"
        name="noteOfMoMo"
        rules={[
          {
            required: true,
            message: "Note of MoMo can not be blank",
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

export default TabMoMo;
