import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import {
  createUserRoutes,
  ROLES,
  ROLESDEFAULT,
  STATUS,
  STATUSDEFAULT,
} from "../../constants";
import { headers } from "../../helper";
import { selectUser } from "../../state/userSlice";

const UserCreate = () => {
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [status, setStatus] = useState(Object.keys(STATUSDEFAULT)[0]);
  const [roleID, setRoleID] = useState(Object.keys(ROLESDEFAULT)[1]);
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);

  // Set title
  useEffect(() => {
    document.title = "Create User";
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Create new user
      const { data } = await axios.post(
        "/user",
        { ...values, status, roleID },
        { headers: headers(accessToken) }
      );

      // Check if data is success
      if (data.success) {
        toast.success(data.message);
      }

      // After that, set is finish to false
      setIsFinish(false);

      // Navigate to view user details
      navigate(`/users/${data.data.user._id}/view-details`);
    } catch ({ response }) {
      // Set error notification
      toast.error(response.data.message);

      // After that, set is finish to false
      setIsFinish(false);
    }
  };

  // Handle change select
  const handleChangeStatus = (value) => {
    setStatus(value);
  };

  // Handle change role ID
  const handleChangeRoleID = (value) => {
    setRoleID(value);
  };

  return (
    <div className="h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={createUserRoutes} />
      {/* Heading */}
      <Heading title={createUserRoutes[2].name} />

      {/* Form */}
      <Form
        name="create-user"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 6,
        }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          banned: false,
          status: Object.keys(STATUSDEFAULT)[0],
          roleID: Object.keys(ROLESDEFAULT)[1],
        }}
        className="grid grid-cols-1 md:grid-cols-2 pr-4 md:pr-0"
      >
        <div>
          {/* Email input */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email cannot be blank.",
              },
              {
                type: "email",
                message: "Email is not a valid email address.",
              },
            ]}
            wrapperCol={{ span: 16, offset: 1 }}
          >
            <Input />
          </Form.Item>

          {/* Username input */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Username cannot be blank.",
              },
            ]}
            wrapperCol={{ span: 16, offset: 1 }}
          >
            <Input />
          </Form.Item>

          {/* Money input */}
          <Form.Item
            label="Money"
            name="money"
            wrapperCol={{ span: 16, offset: 1 }}
            rules={[
              {
                type: "number",
                message: "Money is not a valid number.",
              },
              // {
              //   type: "number",
              //   min: 0,
              //   message: "Money must be greater than or equal to 0.",
              // },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Status Select */}
          <Form.Item
            label="Status"
            name="status"
            wrapperCol={{ span: 16, offset: 1 }}
          >
            <Select onChange={handleChangeStatus} options={STATUS} />
          </Form.Item>
        </div>

        <div>
          {/* Full Name input */}
          <Form.Item
            label="Full Name"
            name="fullName"
            wrapperCol={{ span: 16, offset: 1 }}
          >
            <Input />
          </Form.Item>

          {/* Password input */}
          <Form.Item
            label="Password"
            name="password"
            wrapperCol={{ span: 16, offset: 1 }}
            rules={[
              {
                required: true,
                message: "Password cannot be blank.",
              },
              {
                min: 3,
                message: "Password should contain at least 3 characters.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Role ID Select */}
          <Form.Item
            label="Role ID"
            name="roleID"
            wrapperCol={{ span: 16, offset: 1 }}
          >
            <Select onChange={handleChangeRoleID} options={ROLES} />
          </Form.Item>

          {/* Banned Reason input */}
          <Form.Item
            label="Banned Reason"
            name="bannedReason"
            wrapperCol={{ span: 16, offset: 1 }}
          >
            <Input />
          </Form.Item>
        </div>

        {/* Banned check box */}
        <Form.Item
          name="banned"
          valuePropName="checked"
          wrapperCol={{ offset: 5 }}
          className="w-fit md:w-full"
        >
          <Checkbox value="checked">Banned</Checkbox>
        </Form.Item>

        {/* Create button */}
        <Form.Item wrapperCol={{ offset: 5 }} className="w-fit md:w-full">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
            disabled={isFinish}
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Create</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserCreate;
