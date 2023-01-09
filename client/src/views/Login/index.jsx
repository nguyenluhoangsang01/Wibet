import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { loginRoutes } from "../../constants";
import { capitalize, isValidEmail } from "../../helper";
import {
  loginReducer,
  selectUser,
  updateRememberToFalse,
  updateRememberToTrue,
} from "../../state/userSlice";

const Login = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user, remember } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
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
    if (user) navigate("/");
  }, [navigate, user]);

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

      try {
        // Execute login with post method
        const { data } = await axios.post("/user/login", {
          ...values,
          email,
          username,
        });

        // Check if data is exists, dispatch login reducer to update user logged to global state and render success notification
        if (data) {
          dispatch(loginReducer(data));

          // When login success
          setIsFinish(false);
        }
      } catch ({ response: { data } }) {
        // Check if name error === emailOrUsername will render error notification and clear notification others
        if (data.name === "emailOrUsername") {
          form.current.setFields([
            {
              name: "emailOrUsername",
              errors: [data.message],
            },
          ]);

          form.current.setFields([
            {
              name: "password",
              errors: null,
            },
          ]);
        } else if (data.name === "password") {
          // Check if name error === password will render error notification and clear notification others
          form.current.setFields([
            {
              name: "emailOrUsername",
              errors: null,
            },
          ]);

          form.current.setFields([
            {
              name: "password",
              errors: [data.message],
            },
          ]);
        }

        // When login failure
        setIsFinish(false);
      }

      // Check if user click on remember me, dispatch update remember actions
      if (values.remember) {
        await dispatch(updateRememberToTrue());
      } else {
        await dispatch(updateRememberToFalse());
      }
    } catch (error) {
      // When update failured
      toast.error(error.message);

      // When login failure
      setIsFinish(false);
    }
  };

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
        initialValues={{ remember }}
        onFinish={onFinish}
        autoComplete="off"
        className="h-[calc(100vh-50px-60px-40px-54px-70px)]"
        ref={form}
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
            disabled={isFinish}
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
