import { Button, Checkbox, Form, Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ROLES, STATUS } from "../../constants";
import { capitalize, headers } from "../../helper";
import { selectUser } from "../../state/userSlice";

const UserUpdate = () => {
  // Get user id from params
  const { id } = useParams();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(user?.status);
  const [roleID, setRoleID] = useState(user?.roleID);
  const [isBanned, setIsBanned] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Initial form ref
  const form = useRef(null);
  // Get user logged
  const userLogged = useSelector(selectUser);
  const { accessToken } = useSelector(selectUser);

  // Check if user logged not exists
  useEffect(() => {
    if (!userLogged.user) navigate("/");
  }, [navigate, userLogged.user]);

  // Check if user logged role ID is difference Admin back to home page
  useEffect(() => {
    if (userLogged.user?.roleID !== "Admin") navigate("/");
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
        const { data } = await axios.get(`/user/${id}`, {
          headers: headers(accessToken),
        });

        // Check if data exists
        if (data) {
          // Set team with data found
          setUser(data.data);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        if (response.status === 500) {
          navigate("/users");
        } else if (!response.data.success) {
          // When get failured
          toast.error(response.data.message);

          navigate("/users");
        }
      }
    })();
  }, [accessToken, id, navigate]);

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
        { headers: headers(accessToken) }
      );

      // After set is finish to false
      setIsFinish(false);

      // Send success notification
      toast.success(data.message);

      // And navigate
      navigate(`/users/${user._id}/view-details`);
    } catch ({ response: { data } }) {
      // When update failured
      if (data.name === "email") {
        form.current.setFields([
          {
            name: "email",
            errors: [data.message],
          },
          {
            name: "username",
            errors: null,
          },
          {
            name: "newPassword",
            errors: null,
          },
        ]);
      } else if (data.name === "username") {
        form.current.setFields([
          {
            name: "username",
            errors: [data.message],
          },
          {
            name: "email",
            errors: null,
          },
          {
            name: "newPassword",
            errors: null,
          },
        ]);
      } else if (data.name === "newPassword") {
        form.current.setFields([
          {
            name: "newPassword",
            errors: [data.message],
          },
          {
            name: "email",
            errors: null,
          },
          {
            name: "username",
            errors: null,
          },
        ]);
      }

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
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={userViewDetailsUpdateRules} key={user?._id} />
      {/* Heading */}
      <Heading title={`update user: ${user?.username}`} />

      {/* Form */}
      <Form
        name="update-user"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ ...user }}
        className="grid grid-cols-1 md:grid-cols-2 pr-4 md:pr-0 md:gap-10"
        ref={form}
        layout="vertical"
      >
        <div>
          {/* Email input */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email cannot be blank",
              },
              {
                pattern: "^(.*)@(tma).com.vn",
                message: "Email is not a valid email address",
              },
            ]}
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
                message: "Username cannot be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Money input */}
          <Form.Item label="Money">
            <Input disabled value={user?.money} />
          </Form.Item>
          {/* <Form.Item
            label="Money"
            name="money"
            rules={[
              {
                type: "number",
                message: "Money is not a valid number",
              },
              {
                type: "number",
                min: 0,
                message: "Money must be greater than or equal to 0",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item> */}

          {/* Status Select */}
          <Form.Item label="Status" name="status">
            <Select
              onChange={handleChangeStatus}
              options={STATUS}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </div>

        <div>
          {/* Full Name input */}
          <Form.Item label="Full Name" name="fullName">
            <Input />
          </Form.Item>

          {/* New Password input */}
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                min: 3,
                message: "New Password should contain at least 3 characters",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Role ID Select */}
          <Form.Item label="Role ID" name="roleID">
            <Select
              onChange={handleChangeRoleID}
              options={ROLES}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {/* Banned Reason input */}
          <Form.Item label="Banned Reason" name="bannedReason">
            <Input />
          </Form.Item>
        </div>

        {/* Banned check box */}
        <Form.Item name="banned" valuePropName="checked">
          <Checkbox value="checked" onClick={() => setIsBanned(!isBanned)}>
            Banned
          </Checkbox>
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
    </div>
  );
};

export default UserUpdate;
