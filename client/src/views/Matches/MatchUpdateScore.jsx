import { Button, Checkbox, Form, Image, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { capitalize, headers } from "../../helper";
import { selectUser, updateUserReducer } from "../../state/userSlice";

const MatchUpdateScore = () => {
  // Get match id from request params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [result, setResult] = useState("Draw");
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Redux
  const dispatch = useDispatch();

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role id not equal Admin
  useEffect(() => {
    if (user.roleID !== "Admin") navigate("/matches");
  }, [navigate, user.roleID]);

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

  // Check if match had result
  if (match.result) return <Navigate to="/matches" />;

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
      path: `/matches/${match?._id}/view-details`,
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
        // Send success notification
        toast.success(data.message);

        // After set is finish to false
        setIsFinish(false);

        // Update user logged
        dispatch(updateUserReducer(data));

        // And navigate to matches
        navigate("/matches");
      }
    } catch ({ response }) {
      // When update failured
      toast.error(response.data.message);

      // After set is finish to false
      setIsFinish(false);
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
    <div className="h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchUpdateScore} key={match?._id} />

      {/* Heading */}
      <h1 className="capitalize text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4 flex-col md:flex-row">
        <p>update score:</p>
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

      {/* Note */}
      <div className="w-full bg-[#fcf8e3] text-[#8a6d3b] mb-[20px] p-[15px] rounded font-[arial]">
        <p>
          <b>Note:</b> After you update score of this match, you cannot update
          this match anymore.
        </p>
      </div>

      {/* Form */}
      <Form
        name="update-score"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
        initialValues={{ autoGenerate, result }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Result of team 1 input */}
        <Form.Item
          label={match?.team1?.fullName}
          name="resultOfTeam1"
          rules={[
            {
              required: true,
              message: `${match?.team1?.fullName} cannot be blank.`,
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
              message: `${match?.team2?.fullName} cannot be blank.`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Remember check box */}
        <Form.Item
          name="autoGenerate"
          valuePropName="checked"
          wrapperCol={{ offset: 3, span: 19 }}
        >
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
              />
            </Form.Item>

            {/* Description textarea */}
            <Form.Item label="Description" name="description">
              <TextArea rows={6} />
            </Form.Item>
          </>
        )}

        {/* Update Score button */}
        <Form.Item wrapperCol={{ offset: 3, span: 19 }}>
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
