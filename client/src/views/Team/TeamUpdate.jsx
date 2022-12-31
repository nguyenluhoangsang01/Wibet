import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Dropzone from "../../components/Dropzone";
import Heading from "../../components/Heading";
import RenderFile from "../../components/RenderFile";
import { headersFormData } from "../../constants";
import { updateTeamReducer } from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const TeamUpdate = () => {
  // Initial location
  const {
    state: { team },
  } = useLocation();
  // Initial State
  const [isFinish, setIsFinish] = useState(false);
  const [file, setFile] = useState(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user } = useSelector(selectUser);

  // Set title
  useEffect(() => {
    document.title = "Update Team";
  }, []);

  useEffect(() => {
    if (!user) return navigate("/");
  }, [user, navigate]);

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
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Update team with team id
      const res = await axios.patch(
        `/team/${team._id}`,
        { ...values, image: file },
        { headers: headersFormData }
      );

      // Check if data is exists
      if (res.data) {
        // Dispatch action to update all teams
        dispatch(updateTeamReducer(res.data));

        // Then set is finish to false
        setIsFinish(false);

        // And navigate to teams page
        navigate("/teams");
      }
    } catch ({ response }) {
      // Check if data is exists when have occur error
      if (response.data) {
        // Dispatch action to update all teams (maybe)
        dispatch(updateTeamReducer(response.data));

        // Then set is finish to false
        setIsFinish(false);
      }
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
          image: file,
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

        {/* Dropzone file */}
        <Form.Item label="Flag">
          <Dropzone setFile={setFile} />
        </Form.Item>

        {/* Render file */}
        {file && (
          <Form.Item name="image" wrapperCol={{ offset: 3 }}>
            <RenderFile
              file={{
                format: file.type.split("/")[1],
                name: file.name,
                size: file.size,
              }}
            />
          </Form.Item>
        )}

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
