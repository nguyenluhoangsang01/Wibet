import { Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import NumberOfRows from "../../components/NumberOfRows";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const RankingViewDetails = () => {
  // Get id from request params
  const { id } = useParams();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [bets, setBets] = useState([]);
  const [isShow, setIsShow] = useState(false);
  // Get accessToken from global state
  const { accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

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

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/ranking");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  if (!isShow) return <span>Loading...</span>;

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
        <Tooltip
          title={`${match?.team1?.fullName} vs ${match?.team2?.fullName}`}
        >
          <p>
            <span
              className={`min-w-[100px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
                !record?.match?.result
                  ? "bg-[#ffc107] text-[#212529]"
                  : record?.match?.result === record?.team?.fullName
                  ? "bg-[#28a745]"
                  : record?.match?.result !== record?.team?.fullName &&
                    record?.match?.result !== "Draw"
                  ? "bg-[#dc3545]"
                  : record?.match?.result === "Draw" &&
                    "bg-[#ffc107] text-[#212529]"
              }`}
            >
              {match?.team1?.fullName && match?.team1?.fullName}
            </span>{" "}
            vs{" "}
            <span
              className={`min-w-[100px] rounded-full font-bold text-white font-[calibri] text-[16px] inline-flex items-center justify-center px-[7px] py-[3px] h-[22px] ${
                !record?.match?.result
                  ? "bg-[#ffc107] text-[#212529]"
                  : record?.match?.result === record?.team?.fullName
                  ? "bg-[#28a745]"
                  : record?.match?.result !== record?.team?.fullName &&
                    record?.match?.result !== "Draw"
                  ? "bg-[#dc3545]"
                  : record?.match?.result === "Draw" &&
                    "bg-[#ffc107] text-[#212529]"
              }`}
            >
              {match?.team2?.fullName && match?.team2?.fullName}
            </span>
          </p>
        </Tooltip>
      ),
    },
    {
      title: "Rate",
      dataIndex: "match",
      key: "match",
      render: (match) => <span>0:{match?.rate}</span>,
    },
    {
      title: "Option",
      dataIndex: "team",
      key: "team",
      render: (team) => <span>{team?.fullName && team?.fullName}</span>,
    },
    {
      title: "Placed",
      dataIndex: "bet",
      key: "bet",
      render: (data, record) => <span>{record?.money}</span>,
    },
    {
      title: "Bet result",
      dataIndex: "bet",
      key: "bet",
      render: (data, record) => (
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
            Total <span className="font-bold">{[...bets].length}</span> bet
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={[...bets].reverse()}
        loading={!bets}
        scroll={{ x: "90vw" }}
      />
    </div>
  );
};

export default RankingViewDetails;
