import { Image, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NumberOfRows from "../../components/NumberOfRows";
import { capitalize, headers } from "../../helper";
import { selectBet } from "../../state/betSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const BetViewAll = () => {
  // Get match id from params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  const [isShow, setIsShow] = useState(false);
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial navigate
  const navigate = useNavigate();
  // Get all bets from global state
  const { bets } = useSelector(selectBet);
  // Initial dispatch
  const dispatch = useDispatch();

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
      name: "view all bets",
    },
  ];

  // Columns
  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <span className={record?.user?._id === user?._id ? "font-bold" : ""}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
      },
      render: (text, record) => (
        <span className={record?.user?._id === user?._id ? "font-bold" : ""}>
          {record.user.username}
        </span>
      ),
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      sorter: (a, b) => {
        if (a.option < b.option) return -1;
        if (a.option > b.option) return 1;
      },
      render: (text, record) => (
        <span className={record?.user?._id === user?._id ? "font-bold" : ""}>
          {record.team.fullName}
        </span>
      ),
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      sorter: (a, b) => {
        if (a.money < b.money) return -1;
        if (a.money > b.money) return 1;
      },
      render: (text, record) => (
        <span className={record?.user?._id === user?._id ? "font-bold" : ""}>
          {text}
        </span>
      ),
    },
    {
      title: "Bet Time",
      dataIndex: "betTime",
      key: "betTime",
      sorter: (a, b) => {
        if (a.betTime < b.betTime) return -1;
        if (a.betTime > b.betTime) return 1;
      },
      render: (text, record) => (
        <Tooltip title={text}>
          <span className={record?.user?._id === user?._id ? "font-bold" : ""}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (text, record) => (
        <span
          className={`uppercase min-w-[50px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
            !record.match.result
              ? "bg-inherit text-[#212529] font-normal"
              : record.match.result === record.team.fullName
              ? "bg-[#28a745]"
              : record.match.result !== record.team.fullName &&
                record.match.result !== "Draw"
              ? "bg-[#dc3545]"
              : record.match.result === "Draw" && "bg-[#ffc107] text-[#212529]"
          }`}
        >
          {!record.match.result
            ? "-"
            : record.match.result === record.team.fullName
            ? "W"
            : record.match.result !== record.team.fullName &&
              record.match.result !== "Draw"
            ? "L"
            : record.match.result === "Draw" && "D"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchUpdateScore} key={match?._id} />

      {/* Heading */}
      <div className="text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] text-[#333]">
        <h2 className="text-[30px] mb-[10px] mt-[20px]">View all bets</h2>
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

      {/* Number of rows */}
      <NumberOfRows>
        {bets.bets.filter((bet) => bet.match?._id === id).length < 1 ? (
          "No result found"
        ) : (
          <span>
            Total{" "}
            <span className="font-bold">
              {bets.bets.filter((bet) => bet.match?._id === id).length}
            </span>{" "}
            bet
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={
          bets?.bets &&
          [...bets?.bets?.filter((bet) => bet.match?._id === id)]?.reverse()
        }
        className="pt-[25px] -mt-4"
        loading={!bets?.bets}
        scroll={{ x: "90vw" }}
        pagination={false}
      />
    </div>
  );
};

export default BetViewAll;
