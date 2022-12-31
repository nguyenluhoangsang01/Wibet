import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers, ROLES, STATUS } from "../../constants";
import { capitalize } from "../../helper";
import { selectUser } from "../../state/userSlice";

const UserUpdate = () => {
  // Get user id from params
  const { id } = useParams();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(user?.status);
  const [roleID, setRoleID] = useState(user?.roleID);
  // Initial navigate
  const navigate = useNavigate();
  // Initial form ref
  const form = useRef(null);
  // Get user logged
  const userLogged = useSelector(selectUser);

  // Check if user logged not exists
  useEffect(() => {
    if (!userLogged.user) return navigate("/");
  }, [navigate, userLogged.user]);

  // Check if user logged role ID is difference Admin back to home page
  useEffect(() => {
    if (userLogged.user?.roleID !== "Admin") return navigate("/");
  }, [navigate, userLogged.user?.roleID]);

  // Set title
  useEffect(() => {
    document.title = `Update User: ${capitalize(user?.username)}`;
  }, [user?.username]);

  // Get user by id
  useEffect(() => {
    (async () => {
      try {
        // Get user by id with get method
        const { data } = await axios.get(`/user/${id}`, { headers });

        // Check if data exists
        if (data) {
          // Set team with data found
          setUser(data.data);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        // When get failured
        toast.error(response.data.message);
      }
    })();
  }, [id]);

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
      path: `/users/${user?._id}/view-details`,
      name: user?.username || "key",
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
      const { data } = await axios.patch(
        `/user/${user._id}`,
        { ...values, status, roleID },
        { headers }
      );

      // After set is finish to false
      setIsFinish(false);

      // Send success notification
      toast.success(data.message);

      // And navigate
      navigate(`/users/${user._id}/view-details`);
    } catch ({ response }) {
      // When update failured
      toast.error(response.data.message);

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
      <Breadcrumbs routes={userViewDetailsUpdateRules} key={user?._id} />
      {/* Heading */}
      <Heading title={`update user: ${user?.username}`} />

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
        initialValues={{ ...user }}
        className="grid grid-cols-1 md:grid-cols-2 pr-4 md:pr-0"
        ref={form}
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
