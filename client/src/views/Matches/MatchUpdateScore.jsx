import { Button, Checkbox, Form, Image, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { capitalize, headers } from "../../helper";
import { selectSetting } from "../../state/settingSlice";
import {
  logoutReducerAsync,
  selectUser,
  updateUserReducer,
} from "../../state/userSlice";

const MatchUpdateScore = () => {
  // Get match id from request params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [result, setResult] = useState("Draw");
  const [isShow, setIsShow] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Redux
  const dispatch = useDispatch();
  // Initial form ref
  const form = useRef(null);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role id not equal Admin
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/matches");
  }, [navigate, user?.roleID]);

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
        const { data } = await axios.get(`/match/${id}`, {
          headers: headers(accessToken),
        });

        if (data) {
          setMatch(data.data);

          setIsShow(true);
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

  // Check if match had result
  if (match?.result) navigate("/matches");

  // Breadcrumbs
  const matchUpdateScore = [
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
      name: "Update Score",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update score button
    setIsFinish(true);

    try {
      const { data } = await axios.patch(
        `/match/${match?._id}/score`,
        { ...values },
        { headers: headers(accessToken) }
      );

      if (data) {
        // After set is finish to false
        setIsFinish(false);

        // Update user logged
        dispatch(updateUserReducer(data));

        // And navigate to matches
        navigate("/matches");
      }
    } catch ({ response: { data } }) {
      // When update failure
      if (data.name === "resultOfTeam1") {
        form.current.setFields([
          {
            name: "resultOfTeam1",
            errors: [data.message],
          },
          {
            name: "resultOfTeam2",
            errors: null,
          },
        ]);
      } else if (data.name === "resultOfTeam2") {
        form.current.setFields([
          {
            name: "resultOfTeam2",
            errors: [data.message],
          },
          {
            name: "resultOfTeam1",
            errors: null,
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

  // Handle change bet result
  const handleChangeBetResult = (value) => {
    setResult(value);
  };

  // Handle change checked
  const onChange = (e) => {
    setAutoGenerate(e.target.checked);
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchUpdateScore} key={match?._id} />

      {/* Heading */}
      <h1 className="capitalize text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4 flex-col md:flex-row text-[#333]">
        <p>update score:</p>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team1?.flag}
            width={96}
            preview={false}
            alt={match?.team1?.fullName}
            className="border-4 border-[#DFDFDF] rounded-md overflow-hidden object-cover"
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

      {/* Note */}
      <div className="w-full bg-[#fcf8e3] text-[#8a6d3b] mb-[20px] p-[15px] rounded font-[arial]">
        <p>
          <b>Note:</b> After you update score of this match, you can not update
          this match anymore.
        </p>
      </div>

      {/* Form */}
      <Form
        name="update-score"
        initialValues={{ autoGenerate, result }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        ref={form}
      >
        {/* Result of team 1 input */}
        <Form.Item
          label={match?.team1?.fullName}
          name="resultOfTeam1"
          rules={[
            {
              required: true,
              message: "Team 1 Score can not be blank",
            },
            {
              type: "number",
              min: 0,
              message: "Team 1 Score must be no less than 0",
            },
            {
              type: "number",
              max: settings?.maxScore,
              message: `Team 1 Score must be greater than or equal to ${settings?.maxScore}`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Result of team 2 input */}
        <Form.Item
          label={match?.team2?.fullName}
          name="resultOfTeam2"
          rules={[
            {
              required: true,
              message: "Team 2 Score can not be blank",
            },
            {
              type: "number",
              min: 0,
              message: "Team 2 Score must be no less than 0",
            },
            {
              type: "number",
              max: settings?.maxScore,
              message: `Team 2 Score must be greater than or equal to ${settings?.maxScore}`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Remember check box */}
        <Form.Item name="autoGenerate" valuePropName="checked">
          <Checkbox
            checked={autoGenerate}
            onChange={onChange}
            className="select-none !font-normal"
          >
            Auto generate the bet result of this match.
          </Checkbox>
        </Form.Item>

        {!autoGenerate && (
          <>
            {/* Bet result select */}
            <Form.Item label="Bet result" name="result">
              <Select
                onChange={handleChangeBetResult}
                options={[
                  {
                    value: "Draw",
                    label: "Draw",
                  },
                  {
                    value: match?.team1?.fullName,
                    label: match?.team1?.fullName,
                  },
                  {
                    value: match?.team2?.fullName,
                    label: match?.team2?.fullName,
                  },
                ]}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            {/* Description textarea */}
            <Form.Item label="Description" name="description">
              <TextArea rows={6} />
            </Form.Item>
          </>
        )}

        {/* Update Score button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
            disabled={isFinish}
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Update Score</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MatchUpdateScore;
