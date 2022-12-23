import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { loginRoutes } from "../../constants";
import { loginReducerAsync, selectUser } from "../../state/userSlice";

const Login = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user } = useSelector(selectUser);

  // Handle submit finish
  const onFinish = (values) => {
    dispatch(loginReducerAsync(values));
  };

  // Check if user not logged
  if (user) return <Navigate to="/" />;

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={loginRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Form */}
      <Form
        name="login"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 6,
        }}
        initialValues={{
          remember: false,
        }}
        onFinish={onFinish}
        autoComplete="off"
        className="h-[calc(100vh-60px*2-24px*2-32px-16px-40px-36px)]"
      >
        {/* Email / Username input */}
        <Form.Item
          label="Email / Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Email / Username cannot be blank.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Password input */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Password cannot be blank.",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* Remember check box */}
        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Checkbox value="checked">Remember Me</Checkbox>
        </Form.Item>

        {/* Login button */}
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" className="bg-black">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
