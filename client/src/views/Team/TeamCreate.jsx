import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { createTeamRoutes, headers } from "../../constants";
import { updateTeamReducer } from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const TeamCreate = () => {
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();

  // Check if user not exists
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      const res = await axios.post(`/team`, { ...values }, { headers });

      if (res.data) {
        dispatch(updateTeamReducer(res.data));

        setIsFinish(false);

        navigate("/teams");
      }
    } catch ({ response }) {
      if (response.data) {
        dispatch(updateTeamReducer(response.data));

        setIsFinish(false);
      }
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={createTeamRoutes} />
      {/* Heading */}
      <Heading title={createTeamRoutes[2].name} />

      {/* Form */}
      <Form
        name="create-team"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          name: "",
          fullName: "",
          image: "",
        }}
      >
        {/* Name input */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Name cannot be blank.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Full Name input */}
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Full Name cannot be blank.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Flag input */}
        <Form.Item label="Flag" name="image">
          <Input type="file" />
        </Form.Item>

        {/* Create button */}
        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Create</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TeamCreate;
