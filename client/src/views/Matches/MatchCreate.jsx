import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { createMatchRoutes } from "../../constants";
import { headers } from "../../helper";
import { updateMatchReducer } from "../../state/matchSlice";
import { selectSetting } from "../../state/settingSlice";
import { selectTeam } from "../../state/teamSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const MatchCreate = () => {
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [team1Selected, setTeam1Selected] = useState("");
  const [team2Selected, setTeam2Selected] = useState("");
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Get all teams from global state
  const {
    teams: { teams },
  } = useSelector(selectTeam);
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial form ref
  const form = useRef(null);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);

  // Set title
  useEffect(() => {
    document.title = createMatchRoutes[2].name;
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role id not equal Admin
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/matches");
  }, [navigate, user?.roleID]);

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Use post method to create a new match
      const res = await axios.post(
        `/match`,
        { ...values },
        { headers: headers(accessToken) }
      );

      if (res.data) {
        // Dispatch actions to update all matches
        dispatch(updateMatchReducer(res.data));

        // Set is finish to false
        setIsFinish(false);

        // And navigate to matches
        navigate("/matches");
      }
    } catch ({ response: { data } }) {
      // When create failure
      if (data.name === "team1") {
        form.current.setFields([
          {
            name: "team1",
            errors: [data.message],
          },
          {
            name: "team2",
            errors: null,
          },
          {
            name: "matchDate",
            errors: null,
          },
          {
            name: "rate",
            errors: null,
          },
        ]);
      } else if (data.name === "team2") {
        form.current.setFields([
          {
            name: "team1",
            errors: null,
          },
          {
            name: "team2",
            errors: [data.message],
          },
          {
            name: "matchDate",
            errors: null,
          },
          {
            name: "rate",
            errors: null,
          },
        ]);
      } else if (data.name === "matchDate") {
        form.current.setFields([
          {
            name: "team1",
            errors: null,
          },
          {
            name: "team2",
            errors: null,
          },
          {
            name: "matchDate",
            errors: [data.message],
          },
          {
            name: "rate",
            errors: null,
          },
        ]);
      } else if (data.name === "rate") {
        form.current.setFields([
          {
            name: "team1",
            errors: null,
          },
          {
            name: "team2",
            errors: null,
          },
          {
            name: "matchDate",
            errors: null,
          },
          {
            name: "rate",
            errors: [data.message],
          },
        ]);
      }

      if (data.name === "team") {
        toast.error(data.message);
      }

      // Set is finish to false
      setIsFinish(false);

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }
    }
  };

  // Handle change team 1
  const handleChangeTeam1 = (team1) => {
    setTeam1Selected(team1);
  };

  // Handle change team 2
  const handleChangeTeam2 = (team2) => {
    setTeam2Selected(team2);
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={createMatchRoutes} />
      {/* Heading */}
      <Heading title={createMatchRoutes[2].name} />

      {/* Form */}
      <Form
        name="create"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          team1: "",
          team2: "",
          matchDate: "",
          rate: "",
          description: "",
        }}
        ref={form}
        layout="vertical"
      >
        {/* Team 1 select */}
        <Form.Item
          label="Team 1"
          name="team1"
          rules={[
            {
              required: true,
              message: "Team 1 can not be blank",
            },
          ]}
        >
          <Select
            onChange={handleChangeTeam1}
            options={[...teams]
              .sort((a, b) => a.fullName - b.fullName)
              .filter((team) => team._id !== team2Selected)
              .map((team) => ({
                value: team._id,
                label: `${team.name} - ${team.fullName}`,
              }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Team 2 select */}
        <Form.Item
          label="Team 2"
          name="team2"
          rules={[
            {
              required: true,
              message: "Team 2 can not be blank",
            },
          ]}
        >
          <Select
            onChange={handleChangeTeam2}
            options={[...teams]
              .sort((a, b) => a.fullName - b.fullName)
              .filter((team) => team._id !== team1Selected)
              .map((team) => ({
                value: team._id,
                label: `${team.name} - ${team.fullName}`,
              }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Match Date */}
        <Form.Item
          label="Match Date"
          name="matchDate"
          rules={[
            {
              required: true,
              message: "Match Date can not be blank",
            },
          ]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            allowClear={false}
            disabledDate={(current) => current.isBefore(moment())}
          />
        </Form.Item>

        {/* Rate input */}
        <Form.Item
          label="Rate"
          name="rate"
          rules={[
            {
              required: true,
              message: "Rate can not be blank",
            },
            {
              type: "number",
              message: "Rate is not a valid number",
            },
            {
              type: "number",
              min: settings?.minRate,
              message: `Rate must be greater than or equal to ${settings?.minRate}`,
            },
            {
              type: "number",
              max: settings?.maxRate,
              message: `Rate must be less than or equal to ${settings?.maxRate}`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Description textarea */}
        <Form.Item label="Description" name="description">
          <TextArea rows={6} />
        </Form.Item>

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

export default MatchCreate;
