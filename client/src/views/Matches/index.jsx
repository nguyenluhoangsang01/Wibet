import { Image, Table } from "antd";
import React, { useEffect } from "react";
import { BsCloudMinusFill, BsEyeSlashFill, BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FaShare } from "react-icons/fa";
import { MdViewWeek } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { matchesRoutes } from "../../constants";
import { capitalize, formatTime } from "../../helper";
import { getAllMatchesReducerAsync, selectMatch } from "../../state/matchSlice";
import { selectUser } from "../../state/userSlice";

const Matches = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);
  // Get matches form global state
  const { matches } = useSelector(selectMatch);
  // Initial dispatch
  const dispatch = useDispatch();

  // Get all users
  useEffect(() => {
    dispatch(getAllMatchesReducerAsync());
  }, [dispatch]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user is null
  if (!user) return <Navigate to="/" />;

  // Handle bet
  const handleBet = () => {
    console.log("handleBet");
  };
  // Handle view all bets
  const handleViewAllBet = () => {
    console.log("handleViewAllBet");
  };
  // Handle update info
  const handleUpdateInfo = () => {
    console.log("handleUpdateInfo");
  };
  // Handle update score
  const handleUpdateScore = () => {
    console.log("handleUpdateScore");
  };
  // Handle view detail
  const handleViewDetail = () => {
    console.log("handleViewDetail");
  };
  // Handle delete
  const handleDelete = () => {
    console.log("handleDelete");
  };
  // Handle hide
  const handleHide = () => {
    console.log("handleHide");
  };
  // Handle withdraw
  const handleWithdraw = () => {
    console.log("handleWithdraw");
  };

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      width: 20,
      render: (text, record, index) => (
        <p className="text-center">{index + 1}</p>
      ),
    },
    {
      title: "Team 1",
      dataIndex: "team1",
      key: "team1",
      width: 100,
      sorter: (a, b) => {
        if (a.team1 < b.team1) return -1;
        if (a.team1 > b.team1) return 1;
      },
      render: (text) => (
        <div className="truncate flex items-center justify-center gap-1">
          <div className="w-[30px] h-[30px] bg-white rounded-md flex items-center justify-center p-1 shadow-2xl">
            <Image
              src={text.flag}
              width={30}
              preview={false}
              alt={text.fullName}
            />
          </div>
          <span className="font-bold">{text.fullName}</span>
        </div>
      ),
    },
    {
      title: "-",
      dataIndex: "resultOfTeam1",
      key: "resultOfTeam1",
      width: 20,
      sorter: (a, b) => {
        if (a.resultOfTeam1 < b.resultOfTeam1) return -2;
        if (a.resultOfTeam1 > b.resultOfTeam1) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block">{text ? text : "-"}</p>
      ),
    },
    {
      title: "-",
      dataIndex: "resultOfTeam2",
      key: "resultOfTeam2",
      width: 20,
      sorter: (a, b) => {
        if (a.resultOfTeam2 < b.resultOfTeam2) return -2;
        if (a.resultOfTeam2 > b.resultOfTeam2) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block">{text ? text : "-"}</p>
      ),
    },
    {
      title: "Team 2",
      dataIndex: "team2",
      key: "team2",
      width: 100,
      sorter: (a, b) => {
        if (a.team2 < b.team2) return -1;
        if (a.team2 > b.team2) return 1;
      },
      render: (text) => (
        <div className="truncate flex items-center justify-center gap-1">
          <div className="w-[30px] h-[30px] bg-white rounded-md flex items-center justify-center p-1 shadow-2xl">
            <Image
              src={text.flag}
              width={30}
              preview={false}
              alt={text.fullName}
            />
          </div>
          <span className="font-bold">{text.fullName}</span>
        </div>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: 50,
      sorter: (a, b) => {
        if (a.rate < b.rate) return -2;
        if (a.rate > b.rate) return 1;
      },
      render: (text) => <p className="text-center truncate block">{text}</p>,
    },
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      width: 100,
      sorter: (a, b) => {
        if (a.matchDate < b.matchDate) return -2;
        if (a.matchDate > b.matchDate) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block">{formatTime(text)}</p>
      ),
    },
    {
      title: "After Rate",
      dataIndex: "rate",
      key: "rate",
      width: 100,
      sorter: (a, b) => {
        if (a.rate < b.rate) return -2;
        if (a.rate > b.rate) return 1;
      },
      render: (text, record) => (
        <p className="text-center truncate block">
          {`${record.team1.name} [${
            record.resultOfTeam1 ? record.resultOfTeam1 : "-"
          } : ${record.resultOfTeam2 ? record.resultOfTeam2 : "-"}] ${
            record.team2.name
          }`}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (
        <p className="text-center truncate block">{text ? text : "0 / 0"}</p>
      ),
    },
    {
      title: "Your Bet",
      dataIndex: "bet-action",
      key: "bet-action",
      width: 100,
      render: (text, record) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleBet(record)}
            className="bg-[#28a745] flex items-center justify-center pl-3 rounded-full text-white font-semibold"
          >
            <span>Bet Now</span> <FaShare />
          </button>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 200,
      render: (text, record) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleViewAllBet(record)}
          >
            <FaShare className="bg-[#222222]" />
          </button>

          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleUpdateInfo(record)}
          >
            <BsPencilFill className="bg-[#f0ad4e]" />
          </button>

          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleUpdateScore(record)}
          >
            <TiTick className="bg-[#47a447]" />
          </button>
          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleViewDetail(record)}
          >
            <MdViewWeek className="bg-[#5bc0de]" />
          </button>

          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleDelete(record)}
          >
            <CgClose className="bg-[#d9534f]" />
          </button>

          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleHide(record)}
          >
            <BsEyeSlashFill className="bg-[#f0ad4e]" />
            {/* <IoEyeSharp className="bg-[#5bc0de]" /> */}
          </button>

          <button
            className="rounded-md overflow-hidden"
            onClick={() => handleWithdraw(record)}
          >
            <BsCloudMinusFill className="bg-[#d2322d]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchesRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={matches.matches}
        scroll={{ x: 1550 }}
      />
    </div>
  );
};

export default Matches;
