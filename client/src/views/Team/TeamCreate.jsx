import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Dropzone from "../../components/Dropzone";
import Heading from "../../components/Heading";
import RenderFile from "../../components/RenderFile";
import { createTeamRoutes } from "../../constants";
import { headersWithMultipartFormData } from "../../helper";
import { updateTeamReducer } from "../../state/teamSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const TeamCreate = () => {
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [file, setFile] = useState(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial form ref
  const form = useRef(null);

  // Set title
  useEffect(() => {
    document.title = createTeamRoutes[2].name;
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Create new team
      const res = await axios.post(
        `/team`,
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
      <Breadcrumbs routes={createTeamRoutes} />

      {/* Heading */}
      <Heading title={createTeamRoutes[2].name} />

      {/* Form */}
      <Form
        name="create-team"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          name: "",
          fullName: "",
          image: file,
        }}
        ref={form}
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

        {/* Create button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2 mr-0 ml-auto"
            disabled={isFinish}
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
