import { Image, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { capitalize, headers } from "../../helper";
import { selectUser } from "../../state/userSlice";

const BetViewAll = () => {
  // Get match id from params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial navigate
  const navigate = useNavigate();

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

  // Check if user role id not equal Admin
  useEffect(() => {
    if (user.roleID !== "Admin") return navigate("/matches");
  }, [navigate, user.roleID]);

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
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Option",
      dataIndex: "option",
      key: "option",
      sorter: (a, b) => {
        if (a.option < b.option) return -1;
        if (a.option > b.option) return 1;
      },
      render: (text) => <span>{text}</span>,
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
      title: "Bet Times",
      dataIndex: "betTimes",
      key: "betTimes",
      sorter: (a, b) => {
        if (a.betTimes < b.betTimes) return -1;
        if (a.betTimes > b.betTimes) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (text) => <span>{text}</span>,
    },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchUpdateScore} key={match?._id} />

      {/* Heading */}
      <h1 className="capitalize text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4">
        <p>view all bets:</p>
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

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={null}
        className="pt-[25px]"
      />
    </div>
  );
};

export default BetViewAll;
