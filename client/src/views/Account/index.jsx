import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import SuccessMessage from "../../components/SuccessMesasge";
import { accountRoutesB } from "../../constants";
import { capitalize, headers } from "../../helper";
import { selectUser, updateProfileReducer } from "../../state/userSlice";

const Account = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user, accessToken } = useSelector(selectUser);
  // State
  const [isFinish, setIsFinish] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  // Redux
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Initial form ref
  const form = useRef(null);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Handle submit finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // Update current user with values get from form
      const res = await axios.patch("/user/update/password", values, {
        headers: headers(accessToken),
      });

      // Check if data is true, dispatch update password reducer action to update new user information to global state, set is finish to false and navigate to home page
      if (res.data) {
        dispatch(updateProfileReducer(res.data));

        setIsFinish(false);

        setIsUpdated(true);

        // Reset form
        form.current.resetFields();
      }
    } catch ({ response: { data } }) {
      if (data.name === "currentPassword") {
        form.current.setFields([
          {
            name: "currentPassword",
            errors: [data.message],
          },
        ]);
      } else if (data.name === "newPassword") {
        form.current.setFields([
          {
            name: "newPassword",
            errors: [data.message],
          },
        ]);
      }

      setIsFinish(false);
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={accountRoutesB} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {isUpdated && <SuccessMessage>Account updated</SuccessMessage>}

      {/* Account form */}
      <Form
        name="account"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 6 }}
        onFinish={onFinish}
        autoComplete="off"
        className="h-[calc(100vh-60px*2-24px*2-32px-16px-40px-36px)]"
        ref={form}
      >
        <div className="divide-y-2">
          {/* Current Password input */}
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Current Password cannot be blank",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="pt-[26px]">
            {/* Email */}
            <Form.Item label="Email">
              <Input disabled value={user?.email} />
            </Form.Item>

            {/* Username */}
            <Form.Item label="Username">
              <Input disabled value={user?.username} />
            </Form.Item>

            {/* New Password input */}
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "New Password cannot be blank",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>
        </div>

        {/* Update button */}
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
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

export default Account;
