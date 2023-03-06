import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Dropzone from "../../components/Dropzone";
import Heading from "../../components/Heading";
import RenderFile from "../../components/RenderFile";
import { headers, headersWithMultipartFormData } from "../../helper";
import { updateTeamReducer } from "../../state/teamSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const TeamUpdate = () => {
  // Get team id from params
  const { id } = useParams();
  // Initial State
  const [isFinish, setIsFinish] = useState(false);
  const [file, setFile] = useState(null);
  const [team, setTeam] = useState(null);
  const [isShow, setIsShow] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial form ref
  const form = useRef(null);

  // Set title
  useEffect(() => {
    document.title = "Update Team";
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Get match by id
  useEffect(() => {
    (async () => {
      try {
        // Get match by id with get method
        const { data } = await axios.get(`/team/${id}`, {
          headers: headers(accessToken),
        });

        // Check if data exists
        if (data) {
          // Set team with data found
          setTeam(data.data);

          setIsShow(true);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/teams");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  if (!isShow) return <span>Loading...</span>;

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
        { headers: headersWithMultipartFormData(accessToken) }
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
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "name") {
        form.current.setFields([
          {
            name: "name",
            errors: [data.message],
          },
          {
            name: "fullName",
            errors: null,
          },
        ]);
      } else if (data.name === "fullName") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "fullName",
            errors: [data.message],
          },
          {
            name: "name",
            errors: null,
          },
        ]);
      }

      // Then set is finish to false
      setIsFinish(false);

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={teamViewDetailsUpdateRules} key={team?._id} />

      {/* Heading */}
      <Heading title={`update team: ${team?.fullName}`} />

      {/* Form */}
      <Form
        name="update-team"
        onFinish={onFinish}
        autoComplete="off"
        ref={form}
        initialValues={{
          ...team,
          image: file,
        }}
        layout="vertical"
      >
        {/* Name input */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Name can not be blank",
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
              message: "Full Name can not be blank",
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
          <Form.Item name="image">
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

export default TeamUpdate;
