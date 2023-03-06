import { Button, Checkbox, Form, InputNumber } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { plainPasswordOptions } from "../../constants";
import { headers } from "../../helper";
import {
	getTheLastSettingReducerAsync,
	selectSetting,
	updateSettingReducer
} from "../../state/settingSlice";
import { selectUser } from "../../state/userSlice";

const TabPassword = () => {
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  // Initial form ref
  const form = useRef(null);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Get access token from global state
  const { accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/setting", {
          headers: headers(accessToken),
        });

        if (data) {
          dispatch(updateSettingReducer(data));

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(updateSettingReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  // Default options selected
  useEffect(() => {
    setCheckedList([
      settings?.isMin && "Min",
      settings?.isMax && "Max",
      settings?.isUppercaseLetter && "Uppercase",
      settings?.isLowercaseLetter && "Lowercase",
      settings?.isNumber && "Digit",
      settings?.isSymbols && "Symbols",
    ]);
  }, [
    settings?.isMin,
    settings?.isMax,
    settings?.isUppercaseLetter,
    settings?.isLowercaseLetter,
    settings?.isNumber,
    settings?.isSymbols,
  ]);

  if (!isShow) return <span>Loading...</span>;

  // Handle select password options
  const onChange = (values) => {
    setCheckedList(values);
  };

  // Handle update Password settings
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        "/setting/password",
        {
          ...values,
          isMin: checkedList.includes("Min"),
          isMax: checkedList.includes("Max"),
          isUppercaseLetter: checkedList.includes("Uppercase"),
          isLowercaseLetter: checkedList.includes("Lowercase"),
          isNumber: checkedList.includes("Digit"),
          isSymbols: checkedList.includes("Symbols"),
        },
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
      if (data.name === "minPassword") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: [data.message],
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
        ]);
      } else if (data.name === "maxPassword") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: [data.message],
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
        ]);
      } else if (data.name === "wrongPasswordTimes") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: [data.message],
          },
        ]);
      }
    }
  };

  return (
    <Form
      name="settingsPassword"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{ ...settings }}
      ref={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
    >
      {/* Min password input */}
      <Form.Item
        label="Min password"
        name="minPassword"
        rules={[
          {
            required: true,
            message: "Min password can not be blank",
          },
          {
            type: "number",
            message: "Min password is not a valid number",
          },
          {
            type: "number",
            min: 3,
            message: "Min password must be greater than or equal to 3",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      {/* Max password input */}
      <Form.Item
        label="Max password"
        name="maxPassword"
        rules={[
          {
            required: true,
            message: "Max password can not be blank",
          },
          {
            type: "number",
            message: "Max password is not a valid number",
          },
          {
            type: "number",
            min: 3,
            message: "Max password must be greater than or equal to 3",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      {/* Wrong password times */}
      <Form.Item
        label="Wrong password times"
        name="wrongPasswordTimes"
        rules={[
          {
            required: true,
            message: "Wrong password times can not be blank",
          },
          {
            type: "number",
            message: "Wrong password times is not a valid number",
          },
          {
            type: "number",
            min: 0,
            message: "Wrong password times must be greater than or equal to 0",
          },
        ]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6 }}>
        <Checkbox.Group
          options={plainPasswordOptions}
          defaultValue={checkedList}
          onChange={onChange}
        />
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

export default TabPassword;
