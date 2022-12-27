import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { updateTeamReducerAsync } from "../../state/teamSlice";

const TeamUpdate = () => {
  // Initial location
  const {
    state: { team },
  } = useLocation();
  // Initial State
  const [isFinish, setIsFinish] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

  // Breadcrumbs
  const teamViewDetailsUpdateRules = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/teams",
      name: "teams",
    },
    {
      path: "",
      name: team?.fullName || "key",
    },
    {
      path: "",
      name: "update",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // Dispatch update team by id reducer async
      await dispatch(updateTeamReducerAsync(team?._id, { ...values }));

      // After set is finish to false
      setIsFinish(false);

      // And navigate
      navigate(`/teams`);
    } catch (error) {
      // When update failured
      toast.error(error.message);

      // After set is finish to false
      setIsFinish(false);
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={teamViewDetailsUpdateRules} key={team?._id} />
      {/* Heading */}
      <Heading title={`update team: ${team?.fullName}`} />

      {/* Form */}
      <Form
        name="update-team"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          name: team?.name,
          fullName: team?.fullName,
          image: team?.flag,
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
          <Input />
        </Form.Item>

        {/* Update button */}
        <Form.Item wrapperCol={{ offset: 3 }}>
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

export default TeamUpdate;
