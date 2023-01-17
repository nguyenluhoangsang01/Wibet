import { Button, Form, InputNumber } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { capitalize, headers } from "../../helper";
import { selectUser } from "../../state/userSlice";

const UserUpdateMoney = () => {
  // Get user id from params
  const { id } = useParams();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [user, setUser] = useState(null);
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
    document.title = `Update User's Money: ${capitalize(user?.username)}`;
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
      name: "update money",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        `/user/money/${user._id}`,
        { ...values },
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
    }
  };

  return (
    <div className="h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={userViewDetailsUpdateRules} key={user?._id} />
      {/* Heading */}
      <Heading title={`update user's money`} />

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
        name="update-money"
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
              message: "Money cannot be blank",
            },
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
          <InputNumber style={{ width: "100%" }} placeholder={0} />
        </Form.Item>

        {/* Update button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2 mr-0 ml-auto"
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

export default UserUpdateMoney;
