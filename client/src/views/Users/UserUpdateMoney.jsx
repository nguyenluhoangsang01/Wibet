import { Button, Form, InputNumber } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { capitalize, headers } from "../../helper";
import {
  logoutReducerAsync,
  selectUser,
  updateProfileReducer,
} from "../../state/userSlice";

const UserUpdateMoney = () => {
  // Get user id from params
  const { id } = useParams();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [user, setUser] = useState(null);
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

  // Check if user logged not exists
  useEffect(() => {
    if (!userLogged?.user) navigate("/");
  }, [navigate, userLogged?.user]);

  // Check if user logged role ID is difference Admin back to home page
  useEffect(() => {
    if (userLogged?.user?.roleID !== "Admin") navigate("/");
  }, [navigate, userLogged?.user?.roleID]);

  // Set title
  useEffect(() => {
    document.title = `Add User's Money: ${capitalize(user?.username)}`;
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
      name: "add money",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click add button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        `/user/money/${user._id}`,
        { ...values },
        { headers: headers(accessToken) }
      );

      if (data) {
        // After set is finish to false
        setIsFinish(false);

        // Add current user information
        dispatch(updateProfileReducer(data));

        // Send success notification
        toast.success(data.message);

        // And navigate
        navigate(`/users/${user._id}/view-details`);
      }
    } catch ({ response: { data } }) {
      // When add failured
      if (data.name === "money") {
        form.current.setFields([
          {
            name: "money",
            errors: [data.message],
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

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={userViewDetailsUpdateRules} key={user?._id} />
      {/* Heading */}
      <Heading title={`add user's money`} />

      <p className="font-[calibri] text-[17px]">
        Username: <span className="font-bold">{user?.username}</span>
      </p>
      <p className="font-[calibri] text-[17px]">
        Current money: <span className="font-bold">{user?.money}</span>
      </p>

      <br />
      <br />

      {/* Form */}
      <Form
        name="add-money"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ money: "" }}
        className="pr-4 md:pr-0 md:gap-10"
        ref={form}
        layout="vertical"
      >
        {/* Money input */}
        <Form.Item
          label="Money"
          name="money"
          rules={[
            {
              required: true,
              message: "Money can not be blank",
            },
            {
              type: "number",
              message: "Money is not a valid number",
            },
            {
              type: "number",
              min: 1,
              message: "Money must be greater than or equal to 1",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} placeholder={1} />
        </Form.Item>

        {/* Add button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2 mr-0 ml-auto"
            disabled={isFinish}
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Add</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserUpdateMoney;
