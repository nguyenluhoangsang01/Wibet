import { Button, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import SuccessMessage from "../../components/SuccessMessage";
import { settingsRoutes } from "../../constants";
import { selectUser } from "../../state/userSlice";

const Settings = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial state
  const [isShow, setIsShow] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isFinishRefresh, setIsFinishRefresh] = useState(false);
  // Initial form ref
  const form = useRef(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user and access token from global state
  const { user, accessToken } = useSelector(selectUser);
  // Get settings from global state
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

  if (!isShow) return <span>Loading...</span>;

  // Handle refresh setting action
  const handleRefresh = async () => {
    // Initial loading with true when user click create button
    setIsFinishRefresh(true);
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
          {isFinishRefresh && (
            <AiOutlineLoading3Quarters className="animate-spin" />
          )}
          Refresh
        </button>
      </div>

      {isUpdated && (
        <SuccessMessage isUpdated={isUpdated} setIsUpdated={setIsUpdated}>
          Settings updated successfully
        </SuccessMessage>
      )}

      {/* Form */}
      <Form
        name="settings"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 6 }}
        // onFinish={onFinish}
        autoComplete="off"
        // initialValues={{ ...settings }}
        ref={form}
      >
        {/* Update button */}
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
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
    </div>
  );
};

export default Settings;
