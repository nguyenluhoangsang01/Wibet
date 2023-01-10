import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import NumberOfRows from "../../components/NumberOfRows";
import { selectUser } from "../../state/userSlice";

const RankingViewDetails = () => {
  // Get id from request params
  const { id } = useParams();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [bets, setBets] = useState([]);
  // Get accessToken from global state
  const { accessToken } = useSelector(selectUser);

  // Set title
  useEffect(() => {
    document.title = "Ranking";
  });

  // Get bets by user id
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/bet/${id}`);

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
  }, [accessToken, id, navigate]);

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
      dataIndex: "index",
      key: "index",
      render: (text, record) => (
        <span>{[...bets].reverse().indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Match",
      dataIndex: "match",
      key: "match",
      render: (match, record) => (
        <p>
          <span
            className={`min-w-[100px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
              !record.match.result
                ? "bg-[#ffc107] text-[#212529]"
                : record.match.result === record.team.fullName
                ? "bg-[#28a745]"
                : record.match.result !== record.team.fullName &&
                  record.match.result !== "Draw"
                ? "bg-[#dc3545]"
                : record.match.result === "Draw" &&
                  "bg-[#ffc107] text-[#212529]"
            }`}
          >
            {match.team1.fullName}
          </span>{" "}
          vs{" "}
          <span
            className={`min-w-[100px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
              !record.match.result
                ? "bg-[#ffc107] text-[#212529]"
                : record.match.result === record.team.fullName
                ? "bg-[#28a745]"
                : record.match.result !== record.team.fullName &&
                  record.match.result !== "Draw"
                ? "bg-[#dc3545]"
                : record.match.result === "Draw" &&
                  "bg-[#ffc107] text-[#212529]"
            }`}
          >
            {match.team2.fullName}
          </span>
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
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={rankingRoutesViewDetails} />

      {/* Heading */}
      <Heading title={`ranking: ${bets[0]?.user?.username}`} />

      {/* Number of rows */}
      <NumberOfRows>
        {[...bets].length < 1 ? (
          "No result found"
        ) : (
          <span>
            {" "}
            Showing{" "}
            <span className="font-bold">
              1-{[...bets].length < 10 ? [...bets].length : 10}
            </span>{" "}
            of <span className="font-bold">{[...bets].length}</span> item
            {[...bets].length > 1 ? "s" : ""}.
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={[...bets].reverse()}
        loading={bets ? false : true}
        scroll={{ x: "90vw" }}
      />
    </div>
  );
};

export default RankingViewDetails;
