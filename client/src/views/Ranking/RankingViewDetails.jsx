import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers } from "../../constants";

const RankingViewDetails = () => {
  // Get id from request params
  const { id } = useParams();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [bets, setBets] = useState([]);

  // Set title
  useEffect(() => {
    document.title = "Ranking";
  });

  // Get bets by user id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/bet/${id}`, { headers });

        if (data) {
          setBets(data.data.bets);
        }
      } catch ({ response }) {
        if (response.status === 500) {
          navigate("/ranking");
        } else if (!response.data.success) {
          // When get failured
          toast.error(response.data.message);

          navigate("/ranking");
        }
      }
    })();
  }, [id, navigate]);

  console.log(bets);

  const rankingRoutesViewDetails = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/ranking",
      name: "ranking",
    },
    {
      path: "",
      name: "",
    },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Match",
      dataIndex: "match",
      key: "match",
      render: (match) => (
        <p>
          <span>{match.team1.fullName}</span> vs{" "}
          <span>{match.team2.fullName}</span>
        </p>
      ),
    },
    {
      title: "Rate",
      dataIndex: "match",
      key: "match",
      render: (match) => <span>{match.rate}</span>,
    },
    {
      title: "Option",
      dataIndex: "team",
      key: "team",
      render: (team) => <span>{team.fullName}</span>,
    },
    {
      title: "Placed",
      dataIndex: "bet",
      key: "bet",
      render: (data, record) => <span>{record.money}</span>,
    },
    {
      title: "Bet result",
      dataIndex: "bet",
      key: "bet",
      render: (data, record) => (
        <span
          className={`uppercase min-w-[50px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
            !record.match.result
              ? "bg-inherit text-black font-normal"
              : record.match.result === record.team.fullName
              ? "bg-[#28a745]"
              : record.match.result !== record.team.fullName
              ? "bg-[#dc3545]"
              : record.match.result === "Draw" && "bg-[#ffc107] text-[#212529]"
          }`}
        >
          {!record.match.result
            ? "-"
            : record.match.result === record.team.fullName
            ? "W"
            : record.match.result !== record.team.fullName
            ? "L"
            : record.match.result === "Draw" && "D"}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={rankingRoutesViewDetails} />

      {/* Heading */}
      <Heading title={`ranking: ${bets[0]?.user?.username}`} />

      {/* Table */}
      <Table rowKey="_id" columns={columns} dataSource={[...bets].reverse()} />
    </div>
  );
};

export default RankingViewDetails;