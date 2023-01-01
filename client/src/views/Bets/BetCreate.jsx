import { Button, Form, Image, InputNumber, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { headers } from "../../constants";
import { capitalize } from "../../helper";
import { selectBet } from "../../state/betSlice";
import { selectUser, updateUserReducer } from "../../state/userSlice";

const BetCreate = () => {
  // Get match id from params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Get all bets from global state
  const {
    bets: { bets },
  } = useSelector(selectBet);

  // Check if user not exists
  useEffect(() => {
    if (!user) return navigate("/");
  }, [user, navigate]);

  // Check if match had result or canceled
  useEffect(() => {
    if (match.result || match.isCanceled) return navigate("/matches");
  }, [match.isCanceled, match.result, navigate]);

  // Set title
  useEffect(() => {
    document.title = `${capitalize(match?.team1?.fullName)} - ${capitalize(
      match?.team2?.fullName
    )}`;
  });

  // Map over all bets check if user id in this bet equal with user logged and match id existed in bet
  useEffect(() => {
    bets.map(
      (bet) =>
        bet.user?._id.includes(user?._id) &&
        match?._id?.toString() === bet.match?._id &&
        navigate("/matches")
    );
  }, [bets, match?._id, navigate, user?._id]);

  // Get match by id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/match/${id}`, { headers });

        if (data) {
          setMatch(data.data);
        }
      } catch ({ response }) {
        // When get failured
        toast.error(response.data.message);
      }
    })();
  }, [id]);

  // Routes for breadcrumbs
  const createBetRoutes = [
    {
      path: "/",
      name: "home",
    },
    {
      path: `/matches/${match?._id}/view-details`,
      name: `${match?.team1?.fullName} - ${match?.team2?.fullName}`,
    },
    {
      path: "",
      name: "create bet",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Use post method to create a new match
      const res = await axios.post(
        `/bet/${match._id}`,
        { ...values },
        { headers }
      );

      if (res.data) {
        // Dispatch actions to update all matches
        dispatch(updateUserReducer(res.data));

        // Set is finish to false
        setIsFinish(false);

        // And navigate to matches
        navigate("/matches");
      }
    } catch ({ response }) {
      if (response.data) {
        // Dispatch actions to send error notification
        dispatch(updateUserReducer(response.data));

        // Set is finish to false
        setIsFinish(false);
      }
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={createBetRoutes} />

      {/* Heading */}
      <h1 className="capitalize text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4">
        <p>create bet:</p>
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
        name="create-bet"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          team: "",
          money: "",
        }}
      >
        {/* Team select */}
        <Form.Item
          label="Option"
          name="team"
          rules={[
            {
              required: true,
              message: "Option cannot be blank.",
            },
          ]}
        >
          <Select
            options={[
              {
                value: match?.team1?._id,
                label: match?.team1?.fullName,
              },
              {
                value: match?.team2?._id,
                label: match?.team2?.fullName,
              },
            ]}
          />
        </Form.Item>

        {/* Money input */}
        <Form.Item
          label="Money"
          name="money"
          rules={[
            {
              required: true,
              message: "Money cannot be blank.",
            },
            {
              type: "number",
              message: "Money is not a valid number.",
            },
            {
              type: "number",
              min: 50,
              message: "Money must be greater than or equal to 50.",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Create button */}
        <Form.Item wrapperCol={{ offset: 3, span: 19 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Create</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BetCreate;
