import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Dropzone from "../../components/Dropzone";
import Heading from "../../components/Heading";
import RenderFile from "../../components/RenderFile";
import { headers, headersFormData } from "../../constants";
import { updateTeamReducer } from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const TeamUpdate = () => {
  // Get team id from params
  const { id } = useParams();
  // Initial State
  const [isFinish, setIsFinish] = useState(false);
  const [file, setFile] = useState(null);
  const [team, setTeam] = useState(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial form ref
  const form = useRef(null);

  // Set title
  useEffect(() => {
    document.title = "Update Team";
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) return navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") return navigate("/");
  }, [navigate, user?.roleID]);

  // Get match by id
  useEffect(() => {
    (async () => {
      try {
        // Get match by id with get method
        const { data } = await axios.get(`/team/${id}`, { headers });

        // Check if data exists
        if (data) {
          // Set team with data found
          setTeam(data.data);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        // When get failured
        toast.error(response.data.message);
      }
    })();
  }, [id]);

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
        ref={form}
        initialValues={{
          ...team,
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
