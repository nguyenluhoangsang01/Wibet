import { Button, Form, Input, Select, Table } from "antd";
import axios from "axios";
import momentTimezone from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import NumberOfRows from "../../components/NumberOfRows";
import SuccessMessage from "../../components/SuccessMessage";
import { profileRoutes } from "../../constants";
import { capitalize, headers } from "../../helper";
import { getAllBetsReducer, selectBet } from "../../state/betSlice";
import {
  logoutReducerAsync,
  selectUser,
  updateProfileReducer,
} from "../../state/userSlice";

const Profile = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user, accessToken } = useSelector(selectUser);
  // Get all bets from global state
  const { bets } = useSelector(selectBet);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isShow, setIsShow] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial timezones
  const timezones = momentTimezone.tz.names();
  // Initial form ref
  const form = useRef(null);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Get all bets
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/bet", {
          headers: headers(accessToken),
        });

        if (data) {
          dispatch(getAllBetsReducer(data));

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response) {
          dispatch(getAllBetsReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  if (!isShow) return <span>Loading...</span>;

  // Handle submit finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // Update current user with values get from form
      const { data } = await axios.patch("/user/update/profile", values, {
        headers: headers(accessToken),
      });

      // Check if data is true, dispatch update password reducer action to update new user information to global state, set is finish to false and navigate to home page
      if (data) {
        dispatch(updateProfileReducer(data));

        setIsFinish(false);

        setIsUpdated(true);
      }
    } catch ({ response: { data } }) {
      // Check if response return data, set is finish to false and dispatch update password reducer action to update new user information (maybe)
      if (data) {
        dispatch(updateProfileReducer(data));

        if (data.name === "fullName") {
          form.current.setFields([
            {
              name: "fullName",
              errors: [data.message],
            },
            {
              name: "timezone",
              errors: null,
            },
          ]);
        } else if (data.name === "timezone") {
          form.current.setFields([
            {
              name: "timezone",
              errors: [data.message],
            },
            {
              name: "fullName",
              errors: null,
            },
          ]);
        } else if (data.name === "fullName&timezone") {
          form.current.setFields([
            {
              name: "timezone",
              errors: [data.message.replaceAll("full name or", "")],
            },
            {
              name: "fullName",
              errors: [data.message.replaceAll("or timezone", "")],
            },
          ]);
        }

        setIsFinish(false);

        if (data.statusCode === 498) {
          dispatch(logoutReducerAsync(accessToken));
        }
      }
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Team 1 Name",
      dataIndex: "team1",
      key: "team1",
      sorter: (a, b) => {
        if (a.team1 < b.team1) return -1;
        if (a.team1 > b.team1) return 1;
      },
      render: (text, record) => (
        <span>
          {record?.match?.team1?.fullName && record?.match?.team1?.fullName}
        </span>
      ),
    },
    {
      title: "Team 2 Name",
      dataIndex: "team2",
      key: "team2",
      sorter: (a, b) => {
        if (a.team2 < b.team2) return -1;
        if (a.team2 > b.team2) return 1;
      },
      render: (text, record) => (
        <span>
          {record?.match?.team2?.fullName && record?.match?.team2?.fullName}
        </span>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      sorter: (a, b) => {
        if (a.rate < b.rate) return -1;
        if (a.rate > b.rate) return 1;
      },
      render: (text, record) => <span>0:{record?.match?.rate}</span>,
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      sorter: (a, b) => {
        if (a.money < b.money) return -1;
        if (a.money > b.money) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Bet result",
      dataIndex: "result",
      key: "result",
      sorter: (a, b) => {
        if (a.result < b.result) return -1;
        if (a.result > b.result) return 1;
      },
      render: (text, record) => (
        <span
          className={`uppercase min-w-[50px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
            !record?.match?.result
              ? "bg-inherit text-[#212529] font-normal"
              : record?.match?.result === record?.team?.fullName
              ? "bg-[#28a745]"
              : record?.match?.result !== record?.team?.fullName &&
                record?.match?.result !== "Draw"
              ? "bg-[#dc3545]"
              : record?.match?.result === "Draw" &&
                "bg-[#ffc107] text-[#212529]"
          }`}
        >
          {!record?.match?.result
            ? "-"
            : record?.match?.result === record?.team?.fullName
            ? "W"
            : record?.match?.result !== record?.team?.fullName &&
              record?.match?.result !== "Draw"
            ? "L"
            : record?.match?.result === "Draw" && "D"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={profileRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {isUpdated && (
        <SuccessMessage isUpdated={isUpdated} setIsUpdated={setIsUpdated}>
          Profile updated successfully
        </SuccessMessage>
      )}

      <div>
        {/* Form */}
        <Form
          name="login"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 6 }}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ fullName: user?.fullName, timezone: user?.timezone }}
          ref={form}
        >
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

          {/* Timezone input */}
          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[
              {
                required: true,
                message: "Timezone can not be blank",
              },
            ]}
          >
            <Select
              options={timezones.map((timezone) => ({
                value: timezone,
                label: timezone,
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
        {/* Number of rows */}
        <NumberOfRows>
          {[...bets?.bets]?.filter(
            (bet) => bet?.user?._id?.toString() === user?._id?.toString()
          ) < 1 ? (
            "No result found"
          ) : (
            <span>
              Total{" "}
              <span className="font-bold">
                {
                  [...bets?.bets]?.filter(
                    (bet) =>
                      bet?.user?._id?.toString() === user?._id?.toString()
                  )?.length
                }
              </span>{" "}
              bet
            </span>
          )}
        </NumberOfRows>

        {/* Table */}
        {isShow && (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={
              bets?.bets &&
              [...bets?.bets]?.filter(
                (bet) =>
                  bet?.user?._id?.toString() === user?._id?.toString() &&
                  bet?.match
              )
            }
            className="pt-[25px] -mt-4"
            scroll={{ x: "90vw" }}
            loading={!bets?.bets}
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
