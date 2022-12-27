import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ROLES, STATUS } from "../../constants";
import { capitalize } from "../../helper";
import { selectUser, updateUserByIdReducerAsync } from "../../state/userSlice";

const UserUpdate = () => {
  // Initial location
  const {
    state: { user },
  } = useLocation();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [status, setStatus] = useState(user.status);
  const [roleID, setRoleID] = useState(user.roleID);
  // Initial navigate
  const navigate = useNavigate();
  // Initial dispatch
  const dispatch = useDispatch();
  const getData = useSelector(selectUser);

  // Check if user not exists
  useEffect(() => {
    if (!getData.user) {
      navigate("/");
    }
  }, [getData.user, navigate]);

  // Set title
  useEffect(() => {
    document.title = `UPDATE USER: ${capitalize(user.username)}`;
  }, [user.username]);

  // Breadcrumbs
  const userViewDetailsUpdateRules = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/users",
      name: "users",
    },
    {
      path: `/users/${user._id}/view-details`,
      name: user.username || "key",
    },
    {
      path: "",
      name: "update",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // Dispatch update user by id reducer async with 2 values includes userId and values
      await dispatch(
        updateUserByIdReducerAsync(user._id, { ...values, status, roleID })
      );

      // After set is finish to false
      setIsFinish(false);

      // And navigate
      navigate(`/users/${user._id}/view-details`);
    } catch (error) {
      // When update failured
      toast.error(error.message);

      // After set is finish to false
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
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={userViewDetailsUpdateRules} key={user._id} />
      {/* Heading */}
      <Heading title={`update user: ${user.username}`} />

      {/* Form */}
      <Form
        name="update-user"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 6,
        }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          email: user.email,
          username: user.username,
          money: user.money,
          status: user.status,
          fullName: user.fullName,
          roleID: user.roleID,
          banned: user.banned,
          bannedReason: user.bannedReason,
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

          {/* New Password input */}
          <Form.Item
            label="New Password"
            name="newPassword"
            wrapperCol={{ span: 16, offset: 1 }}
            rules={[
              {
                min: 3,
                message: "New Password should contain at least 3 characters.",
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
          wrapperCol={{ offset: 5, span: 16 }}
        >
          <Checkbox value="checked">Banned</Checkbox>
        </Form.Item>

        {/* Update button */}
        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Update</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserUpdate;
