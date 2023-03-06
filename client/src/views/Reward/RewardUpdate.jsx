import { Button, Form, Input, InputNumber } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers } from "../../helper";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const RewardUpdate = () => {
  // Get team id from params
  const { id } = useParams();
  // Initial state
  const [isShow, setIsShow] = useState(false);
  const [reward, setReward] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial form ref
  const form = useRef(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

  // Set title
  useEffect(() => {
    document.title = "Update Reward";
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Get reward by id
  useEffect(() => {
    (async () => {
      try {
        // Get reward by id with get method
        const { data } = await axios.get(`/reward/${id}`);

        // Check if data exists
        if (data) {
          // Set reward with data found
          setReward(data.data);

          // Reset form
          form.current.resetFields();

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  if (!isShow) return <span>Loading...</span>;

  // Breadcrumbs
  const rewardUpdateRoutes = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/settings",
      name: "settings",
    },
    {
      path: "",
      name: reward?.rewardName || "key",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // update reward
      const res = await axios.patch(
        `/reward/${id}`,
        { ...values },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (res.data) {
        // Then set is finish to false
        setIsFinish(false);

        // And navigate to teams page
        navigate("/settings");
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "rewardName") {
        form.current.setFields([
          {
            name: "rewardName",
            errors: [data.message],
          },
          {
            name: "numberOfReward",
            errors: null,
          },
          {
            name: "rewardRate",
            errors: null,
          },
        ]);
      } else if (data.name === "numberOfReward") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "rewardName",
            errors: null,
          },
          {
            name: "numberOfReward",
            errors: [data.message],
          },
          {
            name: "rewardRate",
            errors: null,
          },
        ]);
      } else if (data.name === "rewardRate") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "rewardName",
            errors: null,
          },
          {
            name: "numberOfReward",
            errors: null,
          },
          {
            name: "rewardRate",
            errors: [data.message],
          },
        ]);
      }

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }

      // Then set is finish to false
      setIsFinish(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={rewardUpdateRoutes} key={reward?._id} />

      {/* Heading */}
      <Heading title={`update reward: ${reward?.rewardName}`} />

      {/* Form */}
      <Form
        name="update-reward"
        onFinish={onFinish}
        autoComplete="off"
        ref={form}
        initialValues={{ ...reward }}
        layout="vertical"
      >
        {/* Reward name input */}
        <Form.Item
          label="Reward name"
          name="rewardName"
          rules={[
            {
              required: true,
              message: "Reward name can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Number of reward input */}
        <Form.Item
          label="Number of reward"
          name="numberOfReward"
          rules={[
            {
              required: true,
              message: "Number of reward can not be blank",
            },
            {
              type: "number",
              message: "Number of reward must be an integer",
            },
            {
              type: "number",
              min: 1,
              message: "Number of reward must be greater than or equal to 1",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Reward rate input */}
        <Form.Item
          label="Reward rate"
          name="rewardRate"
          rules={[
            {
              required: true,
              message: "Reward rate can not be blank",
            },
          ]}
        >
          <Input />
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

export default RewardUpdate;
