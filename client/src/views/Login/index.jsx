import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { loginRoutes, REACT_TRANSFORM_SECRET_KEY } from "../../constants";
import { capitalize, isValidEmail } from "../../helper";
import {
	loginReducer,
	logoutReducerAsync,
	selectUser,
	updateRememberToFalse,
	updateRememberToTrue
} from "../../state/userSlice";

const Login = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user, remember, accessToken } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Initial form ref
  const form = useRef(null);
  // Get remember information on local storage
  const values =
    JSON.parse(localStorage.getItem("rememberMe")) &&
    JSON.parse(
      CryptoJS.AES.decrypt(
        JSON.parse(localStorage.getItem("rememberMe")),
        REACT_TRANSFORM_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8)
    );

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

          if (values.remember) {
            localStorage.setItem(
              "rememberMe",
              JSON.stringify(
                CryptoJS.AES.encrypt(
                  JSON.stringify({
                    ...values,
                    email,
                    username,
                  }),
                  REACT_TRANSFORM_SECRET_KEY
                ).toString()
              )
            );
          } else {
            localStorage.removeItem("rememberMe");
          }

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
            {
              name: "password",
              errors: [data.message],
            },
          ]);
        }

        if (data.name === "toastEmailOrUsername") {
          toast.error(data.message);
        }

        // When login failure
        setIsFinish(false);

        if (data.statusCode === 498) {
          dispatch(logoutReducerAsync(accessToken));
        }
      }

      // Check if user click on remember me, dispatch update remember actions
      if (values.remember) {
        dispatch(updateRememberToTrue());
      } else {
        dispatch(updateRememberToFalse());
      }
    } catch (error) {
      // When update failured
      toast.error(error.message);

      dispatch(logoutReducerAsync(accessToken));

      // When login failure
      setIsFinish(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={loginRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Form */}
      <Form
        name="login"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 6 }}
        initialValues={{ ...values, remember }}
        onFinish={onFinish}
        autoComplete="off"
        ref={form}
      >
        {/* Email / Username input */}
        <Form.Item
          label="Email / Username"
          name="emailOrUsername"
          rules={[
            {
              required: true,
              message: "Email / Username can not be blank",
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
              message: "Password can not be blank",
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
          <Checkbox value="checked">Remember me</Checkbox>
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
