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
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { headers, matchesRoutes } from "../../constants";
import { capitalize, formatNumber, formatTime } from "../../helper";
import { getAllBetsReducerAsync, selectBet } from "../../state/betSlice";
import {
  deleteMatchReducerAsync,
  getAllMatchesReducer,
  getAllMatchesReducerAsync,
  selectMatch,
} from "../../state/matchSlice";
import { selectUser, updateUserAfterDeleteBet } from "../../state/userSlice";

const Matches = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);
  // Get all matches form global state
  const { matches } = useSelector(selectMatch);
  // Get all bets from global state
  const {
    bets: { bets },
  } = useSelector(selectBet);
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
  const [openDeleteBet, setOpenDeleteBet] = useState(false);
  const [confirmLoadingDeleteBet, setConfirmLoadingDeleteBet] = useState(false);
  const [selectedBet, setSelectedBet] = useState({
    betId: null,
    matchId: null,
  });
  // Initial navigate
  const navigate = useNavigate();

  // Get all matches
  useEffect(() => {
    dispatch(getAllMatchesReducerAsync());
  }, [dispatch]);

  // Get all bets
  useEffect(() => {
    dispatch(getAllBetsReducerAsync());
  }, [dispatch]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user is null
  if (!user) return <Navigate to="/" />;

  // Handle bet
  const handleBet = (record) => {
    navigate(`/matches/bet/create/${record._id}`, {
      state: {
        match: record,
      },
    });
  };

  // Handle view all bets
  const handleViewAllBet = (record) => {
    navigate(`/matches/bet/view-match/${record._id}`);
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
            `Hide the match between ${record.team1.fullName} and ${record.team2.fullName} successfully!`
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
            `Show the match between ${record.team1.fullName} and ${record.team2.fullName} successfully!`
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

  // Handle delete bet
  const handleDeleteBet = (values) => {
    // Open modal when user click trash icon
    setOpenDeleteBet(true);

    // Set selected bet
    setSelectedBet({ ...values });
  };

  // Handle update bet
  const handleUpdateBet = () => {
    console.log("handleUpdateBet");
  };

  // Handle ok when delete bet
  const handleOkDeleteBet = async () => {
    // Set loading to true first
    setConfirmLoadingDeleteBet(true);

    try {
      const res = await axios.delete(
        `/bet/${selectedBet.betId}/${selectedBet.matchId}`,
        { headers }
      );

      if (res.data) {
        await dispatch(getAllBetsReducerAsync());

        await dispatch(getAllMatchesReducerAsync());

        await dispatch(updateUserAfterDeleteBet(res.data));
      }

      // Set loading to false
      setConfirmLoadingDeleteBet(false);

      // Set open delete bet to false
      setOpenDeleteBet(false);
    } catch ({ response }) {
      // When update failured
      toast.error(response.data.message);

      // Set loading to false
      setConfirmLoadingDeleteBet(false);
    }
  };

  // Handle cancel when do not want delete bet
  const handleCancelDeleteBet = () => {
    setOpenDeleteBet(false);
  };

  // Cols of matches table
  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <p className="font-[calibri] text-[18px]">{index + 1}</p>
      ),
    },
    {
      title: "Team 1",
      dataIndex: "team1",
      key: "team1",
      sorter: (a, b) => {
        if (a.team1 < b.team1) return -1;
        if (a.team1 > b.team1) return 1;
      },
      render: (text) => (
        <div className="truncate flex items-center justify-center gap-1">
          <div className="w-[35px] h-[35px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
            <Image src={text?.flag} preview={false} alt={text?.fullName} />
          </div>
          <span className="font-semibold font-[arial] text-[14px]">
            {text?.fullName}
          </span>
        </div>
      ),
    },
    {
      title: "-",
      dataIndex: "resultOfTeam1",
      key: "resultOfTeam1",
      sorter: (a, b) => {
        if (a.resultOfTeam1 < b.resultOfTeam1) return -1;
        if (a.resultOfTeam1 > b.resultOfTeam1) return 1;
      },
      render: (text) => (
        <span className="font-[calibri] text-[18px]">{text ? text : "-"}</span>
      ),
    },
    {
      title: "-",
      dataIndex: "resultOfTeam2",
      key: "resultOfTeam2",
      sorter: (a, b) => {
        if (a.resultOfTeam2 < b.resultOfTeam2) return -1;
        if (a.resultOfTeam2 > b.resultOfTeam2) return 1;
      },
      render: (text) => (
        <span className="font-[calibri] text-[18px]">{text ? text : "-"}</span>
      ),
    },
    {
      title: "Team 2",
      dataIndex: "team2",
      key: "team2",
      sorter: (a, b) => {
        if (a.team2 < b.team2) return -1;
        if (a.team2 > b.team2) return 1;
      },
      render: (text) => (
        <div className="truncate flex items-center justify-center gap-1">
          <div className="w-[35px] h-[35px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
            <Image
              src={text?.flag}
              width={30}
              preview={false}
              alt={text?.fullName}
            />
          </div>
          <span className="font-semibold font-[arial] text-[14px]">
            {text?.fullName}
          </span>
        </div>
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
      render: (text) => <span>0:{formatNumber(text)}</span>,
    },
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      sorter: (a, b) => {
        if (a.matchDate < b.matchDate) return -1;
        if (a.matchDate > b.matchDate) return 1;
      },
      render: (text) => <span>{formatTime(text)}</span>,
    },
    {
      title: "After Rate",
      dataIndex: "rate",
      key: "rate",
      sorter: (a, b) => {
        if (a.rate < b.rate) return -1;
        if (a.rate > b.rate) return 1;
      },
      render: (text, record) => (
        <span>
          {`${record?.team1?.name} [${
            record?.resultOfTeam1 ? Number(record?.resultOfTeam1) : "-"
          } : ${
            record?.resultOfTeam2
              ? formatNumber(
                  Number(record?.resultOfTeam2) + Number(record?.rate)
                )
              : "-"
          }] ${record?.team2?.name}`}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <span>{`${record.statusOfTeam1} / ${record.statusOfTeam2}`}</span>
      ),
    },
    {
      title: "Your Bet",
      dataIndex: "bet-action",
      key: "bet-action",
      render: (text, record) => (
        <div className="flex items-center justify-center">
          {record.result || record.isCanceled ? (
            <span>-</span>
          ) : (
            <div>
              {record.statusOfTeam1 === 0 && record.statusOfTeam2 === 0 ? (
                <button
                  onClick={() => handleBet(record)}
                  className="bg-[#28a745] flex items-center justify-center rounded-full py-[3px] px-[10px] gap-1"
                >
                  <span className="!p-0 text-white text-[16px] whitespace-nowrap font-bold font-[calibri]">
                    Bet Now
                  </span>{" "}
                  <FaShare className="text-white text-[16px]" />
                </button>
              ) : (
                <div>
                  {bets
                    ?.filter(
                      (bet) =>
                        bet?.match?._id === record?._id &&
                        bet?.user?._id === user?._id
                    )
                    .map((bet) => (
                      <div
                        className="flex items-center divide-x-2 gap-"
                        key={bet._id}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-[18px] font-[calibri]">
                            {bet.team.name}
                          </span>
                          <span className="text-[16px] font-[calibri] rounded-full bg-[#ffc107] py-[3px] px-[10px] font-bold min-w-[50px] max-h-[22px] flex items-center justify-center">
                            {bet.money}p
                          </span>
                        </div>

                        <div className="rounded-full bg-[#ffc107] py-[3px] px-[10px] flex items-center gap-1 text-[16px] text-[#428bca]">
                          <BsPencilFill
                            onClick={handleUpdateBet}
                            className="cursor-pointer"
                          />
                          <CgClose
                            onClick={() =>
                              handleDeleteBet({
                                betId: bet._id,
                                matchId: bet.match._id,
                              })
                            }
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (text, record) => (
        <div>
          <button
            onClick={() => handleViewAllBet(record)}
            className="bg-[#222222]"
          >
            <FaShare />
          </button>

          <button
            onClick={() => handleUpdateInfo(record)}
            disabled={record.result || record.isCanceled}
            className="bg-[#f0ad4e]"
          >
            <BsPencilFill />
          </button>

          {record.result ? (
            <button
              onClick={() => handleViewDetail(record)}
              className="bg-[#5bc0de]"
            >
              <MdViewWeek />
            </button>
          ) : (
            <button
              onClick={() => handleUpdateScore(record)}
              className="bg-[#47a447]"
            >
              <TiTick />
            </button>
          )}

          <button
            onClick={() =>
              handleDelete(
                record._id,
                record?.team1?.fullName,
                record?.team2?.fullName
              )
            }
            className="bg-[#d9534f]"
            disabled={record.isCanceled}
          >
            <CgClose />
          </button>

          <button
            onClick={() => handleHide(record)}
            className={`${record.isShow ? "bg-[#f0ad4e]" : "bg-[#5bc0de]"}`}
          >
            {record.isShow ? <BsEyeSlashFill /> : <IoEyeSharp />}
          </button>

          {!record.result && (
            <button
              onClick={() => handleWithdraw(record)}
              className="bg-[#d2322d]"
            >
              <BsCloudMinusFill />
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

      {/* Action */}
      <div className="action-details mb-[10px] flex items-center justify-end gap-1">
        <Link to="/matches/create">Create Match</Link>
      </div>

      {/* Total */}
      <p className="flex items-center gap-1 font-[calibri] text-[18px]">
        Showing{" "}
        <span className="font-bold">
          1-{matches.length < 10 ? matches.length : 10}
        </span>{" "}
        of <span className="font-bold">{matches.length}</span> match
        {matches.length > 1 ? "es" : ""}.
      </p>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={matches.matches?.filter((match) =>
          user.roleID === "Admin" ? match : match.isShow === true
        )}
        rowClassName={(record) => !record.isShow && "disabled-row"}
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
          <span className="capitalize font-bold">{deleteMatch?.team1}</span> and{" "}
          <span className="capitalize font-bold">{deleteMatch?.team2}</span>?
        </p>
      </Modal>

      {/* Delete Bet Modal */}
      <Modal
        title="Delete bet"
        open={openDeleteBet}
        onOk={handleOkDeleteBet}
        confirmLoading={confirmLoadingDeleteBet}
        onCancel={handleCancelDeleteBet}
        footer={[
          <Button key="cancel" onClick={handleCancelDeleteBet}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={confirmLoadingDeleteBet}
            onClick={handleOkDeleteBet}
            className="bg-black"
          >
            Ok
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this bet?</p>
      </Modal>
    </div>
  );
};

export default Matches;
