import { Button, DatePicker, Form, Image, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { formatTime } from "../../constants";
import { capitalize, headers } from "../../helper";
import { selectSetting } from "../../state/settingSlice";
import { selectTeam } from "../../state/teamSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const MatchUpdateInfo = () => {
  // Get match id from params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState(null);
  const [isFinish, setIsFinish] = useState(false);
  const [team1Selected, setTeam1Selected] = useState("");
  const [team2Selected, setTeam2Selected] = useState("");
  const [isShow, setIsShow] = useState(false);
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
  // Initial dispatch
  const dispatch = useDispatch();
  // Get settings from global state
  const { settings } = useSelector(selectSetting);

  // Set title
  useEffect(() => {
    document.title = `${capitalize(match?.team1?.fullName)} - ${capitalize(
      match?.team2?.fullName
    )}`;
  });

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if match had result
  useEffect(() => {
    if (user?.roleID !== "Admin" || match?.result || match?.isCanceled)
      navigate("/");
  }, [match?.isCanceled, match?.result, navigate, user?.roleID]);

  // Get match by id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/match/${id}`, {
          headers: headers(accessToken),
        });

        if (data) {
          setMatch(data.data);

          setIsShow(true);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/matches");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  if (!isShow) return <span>Loading...</span>;

  // Breadcrumbs
  const matchUpdateInfo = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/matches",
      name: "matches",
    },
    {
      path: "",
      name: `${match?.team1?.fullName} - ${match?.team2?.fullName}` || "key",
    },
    {
      path: "",
      name: "Update Info",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update score button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        `/match/${match?._id}`,
        { ...values },
        { headers: headers(accessToken) }
      );

      // Send success notification
      toast.success(data.message);

      // After set is finish to false
      setIsFinish(false);

      // And navigate to matches
      navigate("/matches");
    } catch ({ response: { data } }) {
      // When update failure
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

      // After set is finish to false
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
      <Breadcrumbs routes={matchUpdateInfo} key={match?._id} />

      {/* Heading */}
      <h1 className="capitalize text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4 flex-col md:flex-row text-[#333]">
        <p>update match:</p>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team1?.flag}
            width={96}
            preview={false}
            alt={match?.team1?.fullName}
            className="border-4 border-[#DFDFDF] rounded-md overflow-hidden"
          />
          <span>{match?.team1?.fullName}</span>
        </div>
        <span>-</span>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team2?.flag}
            width={96}
            preview={false}
            alt={match?.team2?.fullName}
            className="border-4 border-[#DFDFDF] rounded-md overflow-hidden object-cover"
          />
          <span>{match?.team2?.fullName}</span>
        </div>
      </h1>

      {/* Form */}
      <Form
        name="update-info"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          team1: match?.team1?._id,
          team2: match?.team2?._id,
          matchDate: moment(match?.matchDate),
          rate: match?.rate,
          description: match?.description,
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
            format={formatTime}
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

export default MatchUpdateInfo;
