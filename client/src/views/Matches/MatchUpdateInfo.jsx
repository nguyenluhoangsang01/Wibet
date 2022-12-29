import { Button, DatePicker, Form, Image, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { headers } from "../../constants";
import { capitalize } from "../../helper";
import { selectTeam } from "../../state/teamSlice";

const MatchUpdateInfo = () => {
  // Get match id from request params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  const [team1Selected, setTeam1Selected] = useState("");
  const [team2Selected, setTeam2Selected] = useState("");
  // Initial navigate
  const navigate = useNavigate();
  // Get all teams from global state
  const {
    teams: { teams },
  } = useSelector(selectTeam);

  // Set title
  useEffect(() => {
    document.title = `${capitalize(match?.team1?.fullName)} - ${capitalize(
      match?.team2?.fullName
    )}`;
  });

  // Get match by id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/match/${id}`, { headers });

        if (data) {
          setMatch(data.data);
        }
      } catch ({ response }) {
        // When update failured
        toast.error(response.data.message);
      }
    })();
  }, [id]);

  // Check if match had result
  if (match.result || match.isCanceled) return <Navigate to="/matches" />;

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
      path: `/matches/${match?._id}/view-details`,
      name: `${match?.team1?.fullName} - ${match?.team2?.fullName}` || "key",
    },
    {
      path: "",
      name: "Update",
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
        { headers }
      );

      // Send success notification
      toast.success(data.message);

      // After set is finish to false
      setIsFinish(false);

      // And navigate to matches
      navigate("/matches");
    } catch ({ response }) {
      // When update failured
      toast.error(response.data.message);

      // After set is finish to false
      setIsFinish(false);
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

  // Handle date picker
  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchUpdateInfo} key={match?._id} />

      {/* Heading */}
      <h1 className="uppercase flex items-center justify-center gap-4 mt-[20px] mb-[10px] text-[36px] font-[arial] font-bold">
        <p>update match:</p>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team1?.flag}
            width={140}
            preview={false}
            alt={match?.team1?.fullName}
            className="border-4 border-[#DFDFDF] p-2 rounded-md overflow-hidden"
          />
          <span>{match?.team1?.fullName}</span>
        </div>
        <span>-</span>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team2?.flag}
            width={140}
            preview={false}
            alt={match?.team2?.fullName}
            className="border-4 border-[#DFDFDF] p-2 rounded-md overflow-hidden"
          />
          <span>{match?.team2?.fullName}</span>
        </div>
      </h1>

      {/* Form */}
      <Form
        name="update-score"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Team 1 select */}
        <Form.Item
          label="Team 1"
          name="team1"
          rules={[
            {
              required: true,
              message: "Team 1 cannot be blank.",
            },
          ]}
        >
          <Select
            onChange={handleChangeTeam1}
            options={teams
              .filter((team) => team._id !== team2Selected)
              .map((team) => ({
                value: team._id,
                label: `${team.name} - ${team.fullName}`,
              }))}
          />
        </Form.Item>

        {/* Team 2 select */}
        <Form.Item
          label="Team 2"
          name="team2"
          rules={[
            {
              required: true,
              message: "Team 2 cannot be blank.",
            },
          ]}
        >
          <Select
            onChange={handleChangeTeam2}
            options={teams
              .filter((team) => team._id !== team1Selected)
              .map((team) => ({
                value: team._id,
                label: `${team.name} - ${team.fullName}`,
              }))}
          />
        </Form.Item>

        {/* Match Date */}
        <Form.Item
          label="Match Date"
          name="matchDate"
          rules={[
            {
              required: true,
              message: "Match Date cannot be blank.",
            },
          ]}
        >
          <DatePicker
            showTime
            onChange={onChange}
            onOk={onOk}
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
              message: "Rate cannot be blank.",
            },
            {
              type: "number",
              message: "Rate is not a valid number.",
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
        <Form.Item wrapperCol={{ offset: 3, span: 19 }}>
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

export default MatchUpdateInfo;
