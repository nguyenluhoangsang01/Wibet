import { Button, Checkbox, Form, Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ROLES, STATUS } from "../../constants";
import { capitalize, headers } from "../../helper";
import {
	getTheLastSettingReducerAsync,
	selectSetting
} from "../../state/settingSlice";
import {
	logoutReducerAsync,
	selectUser,
	updateProfileReducer
} from "../../state/userSlice";

const UserUpdate = () => {
  // Get user id from params
  const { id } = useParams();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(user?.status);
  const [roleID, setRoleID] = useState(user?.roleID);
  const [isBanned, setIsBanned] = useState(false);
  const [isShow, setIsShow] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Initial form ref
  const form = useRef(null);
  // Get user logged
  const userLogged = useSelector(selectUser);
  const { accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();
  // Get settings from global state
  const { settings } = useSelector(selectSetting);

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

          setIsShow(true);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/users");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  // Get the last setting
  useEffect(() => {
    dispatch(getTheLastSettingReducerAsync(accessToken));
  }, [accessToken, dispatch]);

  if (!isShow) return <span>Loading...</span>;

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

      // Check if current user id equal with user id selected
      if (userLogged.user._id === user._id) {
        dispatch(updateProfileReducer(data));
      }

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

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }
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
                message: "Email can not be blank",
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
                message: "Username can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Money input */}
          <Form.Item label="Money">
            <Input disabled value={user?.money} />
          </Form.Item>

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

          {/* New password input */}
          <Form.Item
            label="New password"
            name="newPassword"
            rules={[
              {
                min: settings?.minPassword,
                message: `New password should contain at least ${settings?.minPassword} characters`,
              },
              {
                max: settings?.maxPassword,
                message: `New password contain up to ${settings?.maxPassword} characters`,
              },
            ]}
          >
            <Input.Password showCount maxLength={settings?.maxPassword} />
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
            <Input disabled={!isBanned} />
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
