import { Button, Form, InputNumber, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { settingsRoutes } from "../../constants";
import { headers } from "../../helper";
import {
  getTheLastSettingReducerAsync,
  selectSetting,
  updateSettingReducer,
} from "../../state/settingSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Settings = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial state
  const [isShow, setIsShow] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isFinishRefresh, setIsFinishRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  // Initial form ref
  const form = useRef(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user and access token from global state
  const { user, accessToken } = useSelector(selectUser);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Initial navigate
  const navigate = useNavigate();

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get the last settings
  useEffect(() => {
    dispatch(getTheLastSettingReducerAsync(accessToken));
  }, [accessToken, dispatch]);

  if (!isShow) return <span>Loading...</span>;

  // Handle refresh setting action
  const handleRefresh = async () => {
    setOpen(true);
  };

  const handleOk = async () => {
    // Initial loading with true when user click refresh button
    setIsFinishRefresh(true);

    try {
      const { data } = await axios.post("/setting", null, {
        headers: headers(accessToken),
      });

      if (data) {
        dispatch(updateSettingReducer(data));

        setOpen(false);

        setIsFinishRefresh(false);

        navigate("/");
      }
    } catch (error) {
      setOpen(false);

      setIsFinishRefresh(false);
    }
  };

  const handleCancel = async () => {
    setOpen(false);
  };

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        "/setting",
        { ...values },
        { headers: headers(accessToken) }
      );

      if (data) {
        dispatch(updateSettingReducer(data));

        setIsFinish(false);

        navigate("/");
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
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
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
        ]);
      } else if (data.name === "maxPassword") {
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
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
        ]);
      } else if (data.name === "minRate") {
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
            name: "minRate",
            errors: [data.message],
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
        ]);
      } else if (data.name === "maxRate") {
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
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: [data.message],
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
        ]);
      } else if (data.name === "minBetMoney") {
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
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: [data.message],
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
        ]);
      } else if (data.name === "maxScore") {
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
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: [data.message],
          },
          {
            name: "defaultMoney",
            errors: null,
          },
        ]);
      } else if (data.name === "defaultMoney") {
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
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: [data.message],
          },
        ]);
      }

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }

      // Then set is finish to false
      setIsFinish(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={settingsRoutes} />

      <div className="flex items-center justify-between action-details">
        {/* Heading */}
        <Heading title={pathname.slice(1)} />

        {/* Action */}
        <button
          className="!bg-[#FFC107] !text-black flex items-center gap-2"
          disabled={isFinishRefresh}
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      {/* Settings form */}
      <Form
        name="settings"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ ...settings }}
        ref={form}
        className="grid grid-cols-1 md:grid-cols-2 pr-4 md:pr-0 md:gap-10"
      >
        {/* Password */}
        <div>
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
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </div>

        {/* Rate */}
        <div>
          {/* Min rate input */}
          <Form.Item
            label="Min rate"
            name="minRate"
            rules={[
              {
                required: true,
                message: "Min rate can not be blank",
              },
              {
                type: "number",
                message: "Min rate is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Max rate input */}
          <Form.Item
            label="Max rate"
            name="maxRate"
            rules={[
              {
                required: true,
                message: "Max rate can not be blank",
              },
              {
                type: "number",
                message: "Max rate is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </div>

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
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

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
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

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
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Update button */}
        <Form.Item>
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

      <Modal
        title="Refresh current settings"
        open={open}
        onOk={handleOk}
        confirmLoading={isFinishRefresh}
        onCancel={handleCancel}
        keyboard={true}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            disabled={isFinishRefresh}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={isFinishRefresh}
            onClick={handleOk}
            className="bg-black"
            disabled={isFinishRefresh}
          >
            Ok
          </Button>,
        ]}
      >
        <p>Are you sure you want to refresh current settings?</p>
      </Modal>
    </div>
  );
};

export default Settings;
