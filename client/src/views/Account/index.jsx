import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { accountRoutesB } from "../../constants";
import { selectUser, updatePasswordReducerAsync } from "../../state/userSlice";

const Account = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);
  // State
  const [isFinish, setIsFinish] = useState(false);
  // Redux
  const dispatch = useDispatch();

  // Check if user is null
  if (!user) return <Navigate to="/" />;

  // Handle submit finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // Dispatch update password reducer async
      await dispatch(updatePasswordReducerAsync(values));

      // When update success
      setIsFinish(false);
    } catch (error) {
      // When update failured
      toast.error(error.message);

      setIsFinish(false);
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={accountRoutesB} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Account form */}
      <Form
        name="account"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 6 }}
        onFinish={onFinish}
        autoComplete="off"
        className="h-[calc(100vh-60px*2-24px*2-32px-16px-40px-36px)]"
      >
        <div className="divide-y-2">
          {/* Current Password input */}
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Current Password cannot be blank.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="pt-[26px]">
            {/* Email */}
            <Form.Item label="Email">
              <Input disabled value={user.email} />
            </Form.Item>

            {/* Username */}
            <Form.Item label="Username">
              <Input disabled value={user.username} />
            </Form.Item>

            {/* New Password input */}
            <Form.Item label="New Password" name="newPassword">
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
