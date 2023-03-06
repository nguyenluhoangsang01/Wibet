import { Button, Form, Image, InputNumber, Select } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
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

const BetUpdate = () => {
  // Get match id and bet id from request params
  const { matchId, betId } = useParams();
  // Initial navigate
  const navigate = useNavigate();
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial state
  const [match, setMatch] = useState({});
  const [bet, setBet] = useState({});
  const [isFinish, setIsFinish] = useState(false);
  const [isShow, setIsShow] = useState(false);
  // Initial form ref
  const form = useRef(null);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Check if match had result or canceled
  useEffect(() => {
    if (match.result || match.isCanceled) navigate("/matches");
  }, [match.isCanceled, match.result, navigate]);

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
        const { data } = await axios.get(`/match/${matchId}`, {
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
  }, [accessToken, dispatch, matchId, navigate]);

  // Get bet by bet id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/bet/${betId}`, {
          headers: headers(accessToken),
        });

        if (data.data) {
          setBet(data.data.bets[0]);

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
  }, [accessToken, betId, dispatch, navigate]);

  if (!isShow) return <span>Loading...</span>;

  // Routes for breadcrumbs
  const updateBetRoutes = [
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
      name: "update bet",
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Use post method to create a new match
      const res = await axios.patch(
        `/bet/${betId}/${matchId}`,
        { ...values },
        { headers: headers(accessToken) }
      );

      if (res.data) {
        // Dispatch actions to update all matches
        dispatch(updateUserReducer(res.data));

        // Set is finish to false
        setIsFinish(false);

        // And navigate to matches
        navigate("/matches");
      }
    } catch ({ response: { data } }) {
      // When update failure
      if (data.name === "option") {
        form.current.setFields([
          {
            name: "team",
            errors: [data.message],
          },
          {
            name: "money",
            errors: null,
          },
        ]);
      } else if (data.name === "money") {
        form.current.setFields([
          {
            name: "money",
            errors: [data.message],
          },
          {
            name: "team",
            errors: null,
          },
        ]);
      } else if (data.name === "bet") {
        form.current.setFields([
          {
            name: "money",
            errors: null,
          },
          {
            name: "team",
            errors: null,
          },
        ]);

        navigate("/matches");

        toast.error(data.message);
      }

      // Set is finish to false
      setIsFinish(false);

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={updateBetRoutes} />

      {/* Heading */}
      <div className="text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] text-[#333]">
        <h2 className="text-[30px] mb-[10px] mt-[20px]">Update bet</h2>
        <div className="flex items-center gap-4">
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
        </div>
      </div>

      {/* Form */}
      <Form
        name="create-bet"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          team: bet?.team?._id,
          money: bet?.money,
        }}
        ref={form}
        layout="vertical"
      >
        {/* Team select */}
        <Form.Item
          label="Option"
          name="team"
          rules={[
            {
              required: true,
              message: "Option can not be blank",
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
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Money input */}
        <Form.Item
          label="Money"
          name="money"
          rules={[
            {
              required: true,
              message: "Money can not be blank",
            },
            {
              type: "number",
              message: "Money is not a valid number",
            },
            {
              type: "number",
              min: settings?.minBetMoney,
              message: `Money must be greater than or equal to ${settings?.minBetMoney}`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
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

export default BetUpdate;
