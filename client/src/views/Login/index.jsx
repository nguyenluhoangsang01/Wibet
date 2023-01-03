import { Button, Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { loginRoutes } from "../../constants";
import { capitalize, isValidEmail } from "../../helper";
import { loginReducerAsync, selectUser } from "../../state/userSlice";

const Login = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Handle submit finish
  const onFinish = async (values) => {
    // Initial loading with true when user click login button
    setIsFinish(true);

    try {
      // Initial variables
      let email, username;

      // Check if emailOrUsername is email or username
      isValidEmail(values.emailOrUsername)
        ? (email = values.emailOrUsername)
        : (username = values.emailOrUsername);

      // Dispatch login reducer async action with 3 values: email or phone, password
      await dispatch(
        loginReducerAsync({
          ...values,
          email,
          username,
        })
      );

      // When login success
      setIsFinish(false);
    } catch (error) {
      // When update failured
      toast.error(error.message);

      setIsFinish(false);
    }
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 6 }}
        initialValues={{ remember: false }}
        onFinish={onFinish}
        autoComplete="off"
        className="h-[calc(100vh-60px*2-24px*2-32px-16px-40px-36px)]"
      >
        {/* Email / Username input */}
        <Form.Item
          label="Email / Username"
          name="emailOrUsername"
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
          wrapperCol={{ offset: 4, span: 16 }}
        >
          <Checkbox value="checked">Remember Me</Checkbox>
        </Form.Item>

        {/* Login button */}
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Login</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
