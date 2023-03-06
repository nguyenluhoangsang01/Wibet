import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers } from "../../helper";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const AccessLevelUpdate = () => {
  // Get team id from params
  const { id } = useParams();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [accessLevel, setAccessLevel] = useState({});
  const [gsCheckbox, setGsCheckbox] = useState(false);
  const [lgsCheckbox, setLgsCheckbox] = useState(false);
  const [isShow, setIsShow] = useState(false);
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
    document.title = "Update Access Level";
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Get access level by id
  useEffect(() => {
    (async () => {
      try {
        // Get access level by id with get method
        const { data } = await axios.get(`/accessLevel/${id}`);

        // Check if data exists
        if (data) {
          // Set access level with data found
          setAccessLevel(data.data);

          setIsShow(true);

          // Reset form
          form.current.resetFields();
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
  const accessLevelUpdateRoutes = [
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
      name: accessLevel?.category || "key",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // update access level
      const { data } = await axios.patch(
        `/accessLevel/${id}`,
        { ...values, isGroupStage: gsCheckbox, isLiveGroupStage: lgsCheckbox },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (data) {
        // Then set is finish to false
        setIsFinish(false);

        // And navigate to settings page
        navigate("/settings");
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "category") {
        form.current.setFields([
          {
            name: "category",
            errors: [data.message],
          },
          {
            name: "detail",
            errors: null,
          },
        ]);
      } else if (data.name === "detail") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "category",
            errors: null,
          },
          {
            name: "detail",
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

  // Handle change group stage
  const onChangeGS = (e) => {
    setGsCheckbox(e.target.checked);
  };

  // Handle change live group stage
  const onChangeLGS = (e) => {
    setLgsCheckbox(e.target.checked);
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={accessLevelUpdateRoutes} key={accessLevel?._id} />

      {/* Heading */}
      <Heading title={`update access level: ${accessLevel?.category}`} />

      {/* Form */}
      <Form
        name="update-reward"
        onFinish={onFinish}
        autoComplete="off"
        ref={form}
        initialValues={{ ...accessLevel }}
        layout="vertical"
      >
        {/* Category input */}
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Category can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Detail input */}
        <Form.Item
          label="Detail"
          name="detail"
          rules={[
            {
              required: true,
              message: "Detail can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Group stage check box */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Checkbox
            defaultChecked={accessLevel?.isGroupStage}
            onChange={onChangeGS}
          >
            Group stage
          </Checkbox>
        </Form.Item>

        {/* Live group stage check box */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Checkbox
            defaultChecked={accessLevel?.isLiveGroupStage}
            onChange={onChangeLGS}
          >
            Live group stage
          </Checkbox>
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

export default AccessLevelUpdate;
