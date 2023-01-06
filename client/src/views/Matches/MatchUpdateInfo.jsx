import { Button, DatePicker, Form, Image, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { capitalize, headers } from "../../helper";
import { selectTeam } from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const MatchUpdateInfo = () => {
  // Get match id from params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState(null);
  const [isFinish, setIsFinish] = useState(false);
  const [team1Selected, setTeam1Selected] = useState("");
  const [team2Selected, setTeam2Selected] = useState("");
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

  // Set title
  useEffect(() => {
    document.title = `${capitalize(match?.team1?.fullName)} - ${capitalize(
      match?.team2?.fullName
    )}`;
  });

  // Check if user not exists
  useEffect(() => {
    if (!user) return navigate("/");
  }, [navigate, user]);

  // Check if match had result
  useEffect(() => {
    if (user.roleID !== "Admin" || match?.result || match?.isCanceled)
      return navigate("/");
  }, [match?.isCanceled, match?.result, navigate, user.roleID]);

  // Get match by id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/match/${id}`, {
          headers: headers(accessToken),
        });

        if (data) {
          setMatch(data.data);

          // Reset form
          form.current.resetFields();
        }
      } catch ({ response }) {
        if (response.status === 500) {
          navigate("/matches");
        } else if (!response.data.success) {
          // When get failured
          toast.error(response.data.message);

          navigate("/matches");
        }
      }
    })();
  }, [accessToken, id, navigate]);

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
        { headers: headers(accessToken) }
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

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchUpdateInfo} key={match?._id} />

      {/* Heading */}
      <h1 className="capitalize text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4 flex-col md:flex-row">
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
            className="border-4 border-[#DFDFDF] rounded-md overflow-hidden"
          />
          <span>{match?.team2?.fullName}</span>
        </div>
      </h1>

      {/* Form */}
      <Form
        name="update-info"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
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
