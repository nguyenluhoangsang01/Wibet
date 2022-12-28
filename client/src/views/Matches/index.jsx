import { Button, Image, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsCloudMinusFill, BsEyeSlashFill, BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FaShare } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MdViewWeek } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers, matchesRoutes } from "../../constants";
import { capitalize, formatTime } from "../../helper";
import {
  deleteMatchReducerAsync,
  getAllMatchesReducer,
  getAllMatchesReducerAsync,
  selectMatch,
} from "../../state/matchSlice";
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
  // Initial state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteMatch, setDeleteMatch] = useState({
    _id: "",
    team1: "",
    team2: "",
  });
  const [openHide, setOpenHide] = useState(false);
  const [confirmLoadingHide, setConfirmLoadingHide] = useState(false);
  const [record, setRecord] = useState({});
  // Initial navigate
  const navigate = useNavigate();

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
  const handleUpdateInfo = (record) => {
    navigate(`/matches/${record._id}/update-info`, {
      state: {
        match: record,
      },
    });
  };

  // Handle update score
  const handleUpdateScore = (record) => {
    navigate(`/matches/${record._id}/update-score`);
  };

  // Handle view detail
  const handleViewDetail = (record) => {
    navigate(`/matches/${record._id}/view-details`, {
      state: {
        match: record,
      },
    });
  };

  // Handle delete
  const handleDelete = (_id, team1, team2) => {
    // Open modal when user click trash icon
    setOpen(true);

    // Set _id, team1 and team2
    setDeleteMatch({
      _id,
      team1,
      team2,
    });
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      await dispatch(deleteMatchReducerAsync(deleteMatch._id));

      // After set loading to false
      setConfirmLoading(false);

      // And delete successfully hide modal
      setOpen(false);
    } catch (error) {
      // Set loading to false if have error
      setConfirmLoading(false);

      // After delete successfully hide modal
      setOpen(false);
    }
  };

  // Handle cancel when user no delete
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle hide
  const handleHide = async (record) => {
    // Open modal when user click eyes icon
    setOpenHide(true);

    // Set record
    setRecord(record);
  };

  // Handle ok hide
  const handleOkHide = async () => {
    // Set loading to true first
    setConfirmLoadingHide(true);

    try {
      if (record.isShow) {
        const res = await axios.patch(
          `/match/${record._id}`,
          {
            ...record,
            isShow: false,
          },
          { headers }
        );
        if (res.data) {
          dispatch(getAllMatchesReducer(res.data));

          // Send success notification
          toast.success(
            `Hide the match ${record.team1.fullName} and ${record.team2.fullName} successfully!`
          );
        }
      } else {
        const res = await axios.patch(
          `/match/${record._id}`,
          {
            ...record,
            isShow: true,
          },
          { headers }
        );
        if (res.data) {
          dispatch(getAllMatchesReducer(res.data));

          // Send success notification
          toast.success(
            `Show the match ${record.team1.fullName} and ${record.team2.fullName} successfully!`
          );
        }
      }

      // Set loading to false
      setConfirmLoadingHide(false);

      // Set open hide to false
      setOpenHide(false);
    } catch ({ response }) {
      // When update failured
      toast.error(response.data.message);

      // Set loading to false
      setConfirmLoadingHide(false);
    }
  };

  // Handle cancel hide
  const handleCancelHide = () => {
    setOpenHide(false);
  };

  // Handle withdraw
  const handleWithdraw = () => {
    console.log("handleWithdraw");
  };

  // Cols of matches table
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
              src={text?.flag}
              width={30}
              preview={false}
              alt={text?.fullName}
            />
          </div>
          <span className="font-bold">{text?.fullName}</span>
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
              src={text?.flag}
              width={30}
              preview={false}
              alt={text?.fullName}
            />
          </div>
          <span className="font-bold">{text?.fullName}</span>
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
      render: (text) => (
        <p className="text-center truncate block">0 : {text}</p>
      ),
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
          {`${record?.team1?.name} [${
            record?.resultOfTeam1 ? Number(record?.resultOfTeam1) : "-"
          } : ${
            record?.resultOfTeam2
              ? Number(record?.resultOfTeam2) + Number(record?.rate)
              : "-"
          }] ${record?.team2?.name}`}
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
      width: 100,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <button
            className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => handleViewAllBet(record)}
          >
            <FaShare className="bg-[#222222]" />
          </button>

          <button
            className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => handleUpdateInfo(record)}
            disabled={record.result}
          >
            <BsPencilFill className="bg-[#f0ad4e]" />
          </button>

          {record.result ? (
            <button
              className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => handleViewDetail(record)}
            >
              <MdViewWeek className="bg-[#5bc0de]" />
            </button>
          ) : (
            <button
              className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => handleUpdateScore(record)}
            >
              <TiTick className="bg-[#47a447]" />
            </button>
          )}

          <button
            className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() =>
              handleDelete(
                record._id,
                record.team1.fullName,
                record.team2.fullName
              )
            }
          >
            <CgClose className="bg-[#d9534f]" />
          </button>

          <button
            className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => handleHide(record)}
          >
            {record.isShow ? (
              <BsEyeSlashFill className="bg-[#f0ad4e]" />
            ) : (
              <IoEyeSharp className="bg-[#5bc0de]" />
            )}
          </button>

          {!record.result && (
            <button
              className="rounded-md overflow-hidden disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => handleWithdraw(record)}
            >
              <BsCloudMinusFill className="bg-[#d2322d]" />
            </button>
          )}
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
        scroll={{ x: 1450 }}
      />

      {/* Delete Modal */}
      <Modal
        title="Delete match"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
            className="bg-black"
          >
            Ok
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete the match between{" "}
          <span className="capitalize font-bold">
            {deleteMatch.team1 ? deleteMatch.team1 : "Team 1"}
          </span>{" "}
          and{" "}
          <span className="capitalize font-bold">
            {deleteMatch.team2 ? deleteMatch.team2 : "Team 2"}
          </span>
          ?
        </p>
      </Modal>

      {/* Hide Modal */}
      <Modal
        title="Hide match"
        open={openHide}
        onOk={handleOkHide}
        confirmLoading={confirmLoadingHide}
        onCancel={handleCancelHide}
        footer={[
          <Button key="cancel" onClick={handleCancelHide}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={confirmLoadingHide}
            onClick={handleOkHide}
            className="bg-black"
          >
            Ok
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to {record.isShow ? "hide" : "show"} the match
          between{" "}
          <span className="capitalize font-bold">
            {deleteMatch.team1 ? deleteMatch.team1 : "Team 1"}
          </span>{" "}
          and{" "}
          <span className="capitalize font-bold">
            {deleteMatch.team2 ? deleteMatch.team2 : "Team 2"}
          </span>
          ?
        </p>
      </Modal>
    </div>
  );
};

export default Matches;
