import { Image, Table, Tooltip } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsCloudMinusFill, BsEyeSlashFill, BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FaShare } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MdViewWeek } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Modals from "../../components/Modals";
import NumberOfRows from "../../components/NumberOfRows";
import { formatTime, matchesRoutes } from "../../constants";
import { capitalize, formatNumber, headers } from "../../helper";
import {
  getAllBetsReducer,
  getAllBetsReducerAsync,
  selectBet,
} from "../../state/betSlice";
import {
  deleteMatchReducerAsync,
  getAllMatchesReducer,
  getAllMatchesReducerAsync,
  selectMatch,
} from "../../state/matchSlice";
import { selectSetting } from "../../state/settingSlice";
import {
  selectUser,
  updateProfileReducer,
  updateUserAfterDeleteBet,
} from "../../state/userSlice";

const Matches = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user, accessToken } = useSelector(selectUser);
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
  const [openWithdrawMatch, setOpenWithdrawMatch] = useState(false);
  const [confirmLoadingWithdrawMatch, setConfirmLoadingWithdrawMatch] =
    useState(false);
  const [selectedBetWithdraw, setSelectedBetWithdraw] = useState(null);
  const [isShow1, setIsShow1] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  // Initial navigate
  const navigate = useNavigate();
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Time to bet
  const [timeBet, setTimeBet] = useState(settings?.timeBet);

  // Get all matches
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/match");

        if (res.data) {
          dispatch(getAllMatchesReducer(res.data));

          setIsShow1(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllMatchesReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  // Get all bets
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/bet", {
          headers: headers(accessToken),
        });

        if (data) {
          dispatch(getAllBetsReducer(data));

          setIsShow2(true);
        }
      } catch ({ response }) {
        if (response) {
          dispatch(getAllBetsReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  useEffect(() => {
    setTimeBet(moment().add(settings?.timeBet, "minutes"));
  }, [settings?.timeBet]);

  if (!isShow1 && !isShow2) return <span>Loading...</span>;

  // Handle bet
  const handleBet = (record) => {
    navigate(`/matches/bet/create/${record._id}`);
  };

  // Handle view all bets
  const handleViewAllBet = (record) => {
    navigate(`/matches/bet/view-match/${record._id}`);
  };

  // Handle update info
  const handleUpdateInfo = (record) => {
    navigate(`/matches/${record._id}/update-info`);
  };

  // Handle update score
  const handleUpdateScore = (record) => {
    navigate(`/matches/${record._id}/update-score`);
  };

  // Handle view detail
  const handleViewDetail = (record) => {
    navigate(`/matches/${record._id}/view-details`);
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
  const handleOk = () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      dispatch(deleteMatchReducerAsync(accessToken, deleteMatch._id));

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
          { headers: headers(accessToken) }
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
          { headers: headers(accessToken) }
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
  const handleWithdraw = (id) => {
    setOpenWithdrawMatch(true);

    setSelectedBetWithdraw(id);
  };

  // Handle ok when withdraw match
  const handleOkWithdrawMatch = async () => {
    // Set loading button first
    setConfirmLoadingWithdrawMatch(true);

    try {
      // Use patch method to update isCanceled to true
      const { data } = await axios.patch(`/bet/${selectedBetWithdraw}`, null, {
        headers: headers(accessToken),
      });

      // Check if data is exists
      if (data.success) {
        // Send success notification
        toast.success(data.message);

        // Set loading button to false
        setConfirmLoadingWithdrawMatch(false);

        // Close modal
        setOpenWithdrawMatch(false);

        // After get all matches
        dispatch(getAllMatchesReducerAsync());

        // Update current user information
        dispatch(updateProfileReducer(data));
      }
    } catch ({ response }) {
      // Check if success is false
      if (!response.data.success) {
        // Set loading button to false
        setConfirmLoadingWithdrawMatch(false);

        // Close modal
        setOpenWithdrawMatch(false);

        // Success error notification
        toast.error(response.data.message);
      }
    }
  };

  // Handle cancel when withdraw match
  const handleCancelWithdrawMatch = () => {
    setOpenWithdrawMatch(false);
  };

  // Handle delete bet
  const handleDeleteBet = (values) => {
    // Open modal when user click trash icon
    setOpenDeleteBet(true);

    // Set selected bet
    setSelectedBet({ ...values });
  };

  // Handle update bet
  const handleUpdateBet = (matchId, betId) => {
    navigate(`/matches/bet/update/${matchId}/${betId}`);
  };

  // Handle ok when delete bet
  const handleOkDeleteBet = async () => {
    // Set loading to true first
    setConfirmLoadingDeleteBet(true);

    try {
      const res = await axios.delete(
        `/bet/${selectedBet.betId}/${selectedBet.matchId}`,
        { headers: headers(accessToken) }
      );

      if (res.data) {
        dispatch(getAllBetsReducerAsync(accessToken));

        dispatch(getAllMatchesReducerAsync());

        dispatch(updateUserAfterDeleteBet(res.data));
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
      dataIndex: "index",
      key: "index",
      width: 20,
      render: (text, record) => (
        <p className="font-[calibri] text-[18px]">
          {[...matches.matches]
            ?.filter((match) =>
              user?.roleID === "Admin" ? match : match.isShow
            )
            .indexOf(record) + 1}
        </p>
      ),
    },
    {
      title: "Team 1",
      dataIndex: "team1",
      key: "team1",
      width: 50,
      render: (text) =>
        text ? (
          <div className="truncate flex items-center gap-1">
            <div className="max-w-[35px] h-[35px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
              <Image
                src={text?.flag}
                preview={false}
                alt={text?.fullName}
                className="object-cover"
              />
            </div>
            <Tooltip title={text?.fullName}>
              <span className="font-semibold font-[arial] text-[14px] obj">
                {text?.fullName}
              </span>
            </Tooltip>
          </div>
        ) : (
          <div className="truncate flex items-center gap-1">
            <div className="max-w-[35px] h-[35px] bg-black rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
              <Image
                src="https://res.cloudinary.com/wibet/image/upload/v1673334255/logo-w_ahvbug.png"
                preview={false}
                alt="Team 1"
                className="object-cover"
              />
            </div>
            <Tooltip title="Team 1">
              <span className="font-semibold font-[arial] text-[14px]">
                Team 1
              </span>
            </Tooltip>
          </div>
        ),
    },
    {
      title: "-",
      dataIndex: "resultOfTeam1",
      key: "resultOfTeam1",
      width: 20,
      render: (text) => (
        <span className="font-[calibri] text-[18px]">
          {text ? text : text === 0 ? "0" : "-"}
        </span>
      ),
    },
    {
      title: "-",
      dataIndex: "resultOfTeam2",
      key: "resultOfTeam2",
      width: 20,
      render: (text) => (
        <span className="font-[calibri] text-[18px]">
          {text ? text : text === 0 ? "0" : "-"}
        </span>
      ),
    },
    {
      title: "Team 2",
      dataIndex: "team2",
      key: "team2",
      width: 50,
      render: (text) =>
        text ? (
          <div className="truncate flex items-center gap-1">
            <div className="max-w-[35px] h-[35px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
              <Image
                src={text?.flag}
                width={30}
                preview={false}
                alt={text?.fullName}
              />
            </div>
            <Tooltip title={text?.fullName}>
              <span className="font-semibold font-[arial] text-[14px]">
                {text?.fullName}
              </span>
            </Tooltip>
          </div>
        ) : (
          <div className="truncate flex items-center gap-1">
            <div className="max-w-[35px] h-[35px] bg-black rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
              <Image
                src="https://res.cloudinary.com/wibet/image/upload/v1673334255/logo-w_ahvbug.png"
                preview={false}
                alt="Team 2"
              />
            </div>
            <Tooltip title="Team 2">
              <span className="font-semibold font-[arial] text-[14px]">
                Team 2
              </span>
            </Tooltip>
          </div>
        ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: 20,
      render: (text) =>
        text === 0 ? (
          <span>0:{text}</span>
        ) : (
          <span>0:{formatNumber(text)}</span>
        ),
    },
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      width: 70,
      render: (text) => (
        <Tooltip title={moment(text).format(formatTime)}>
          <span>{moment(text).format(formatTime)}</span>
        </Tooltip>
      ),
    },
    {
      title: "After Rate",
      dataIndex: "rate",
      key: "rate",
      width: 50,
      render: (text, record) =>
        record.isCanceled ? (
          <span className="bg-[#6c757d] rounded-full gap-1 text-white text-[16px] font-bold font-[calibri] px-4">
            Canceled
          </span>
        ) : (
          <Tooltip
            title={`${record?.team1?.name} [${
              record?.resultOfTeam1
                ? Number(record?.resultOfTeam1)
                : record?.resultOfTeam1 === 0
                ? "0"
                : "-"
            } : ${
              record?.resultOfTeam2
                ? formatNumber(
                    Number(record?.resultOfTeam2) + Number(record?.rate)
                  )
                : record?.resultOfTeam2 === 0
                ? formatNumber(Number(record?.rate))
                : "-"
            }] ${record?.team2?.name || "Team 2"}`}
          >
            <span className="text-center">
              {`${record?.team1?.name} [${
                record?.resultOfTeam1
                  ? Number(record?.resultOfTeam1)
                  : record?.resultOfTeam1 === 0
                  ? "0"
                  : "-"
              } : ${
                record?.resultOfTeam2
                  ? formatNumber(
                      Number(record?.resultOfTeam2) + Number(record?.rate)
                    )
                  : record?.resultOfTeam2 === 0
                  ? formatNumber(Number(record?.rate))
                  : "-"
              }] ${record?.team2?.name || "Team 2"}`}
            </span>
          </Tooltip>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 50,
      render: (text, record) => (
        <Tooltip title={`${record.statusOfTeam1} / ${record.statusOfTeam2}`}>
          <span>{`${record.statusOfTeam1} / ${record.statusOfTeam2}`}</span>
        </Tooltip>
      ),
    },
    {
      title: "Your Bet",
      dataIndex: "bet-action",
      key: "bet-action",
      width: 60,
      render: (text, record) =>
        record.result || moment(record.matchDate).isBefore(timeBet) ? (
          "-"
        ) : (
          <div className="flex items-center justify-center">
            {record.isCanceled ? (
              "-"
            ) : (
              <div>
                {/*  */}
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
                            {bet?.team?.name}
                          </span>
                          <span className="text-[16px] font-[calibri] rounded-full bg-[#ffc107] py-[3px] px-[10px] font-bold min-w-[50px] max-h-[22px] flex items-center justify-center">
                            {bet?.money}p
                          </span>
                        </div>

                        {!record.isCanceled && !record.result && (
                          <div className="rounded-full bg-[#ffc107] py-[3px] px-[10px] flex items-center gap-1 text-[16px] text-[#428bca]">
                            <BsPencilFill
                              onClick={() =>
                                handleUpdateBet(record._id, bet._id)
                              }
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
                        )}
                      </div>
                    ))}
                </div>

                {/*  */}
                {!user?.match.includes(record._id) && (
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleBet(record)}
                      className="bg-[#28a745] flex items-center justify-center rounded-full px-[10px] gap-1 hover:scale-105 transition"
                    >
                      <span className="!p-0 text-white text-[16px] whitespace-nowrap font-bold font-[calibri]">
                        Bet Now
                      </span>{" "}
                      <FaShare className="text-white text-[14px]" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ),
    },
    {
      title: "-",
      dataIndex: "actions",
      fixed: "right",
      width: user?.roleID !== "Admin" ? 30 : 100,
      render: (text, record) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Tooltip title="View All Bets">
              <button
                onClick={() => handleViewAllBet(record)}
                className="bg-[#222222] border-[#222222]"
              >
                <FaShare />
              </button>
            </Tooltip>

            {user?.roleID === "Admin" &&
              (!record.isCanceled && !record.result ? (
                <Tooltip
                  title={` ${
                    !record.isCanceled && !record.result && "Update Info"
                  }`}
                >
                  <button
                    onClick={() => handleUpdateInfo(record)}
                    className="bg-[#f0ad4e] border-[#eea236]"
                    disabled={record.isCanceled || record.result}
                  >
                    <BsPencilFill />
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={() => handleUpdateInfo(record)}
                  className="bg-[#f0ad4e] border-[#eea236]"
                  disabled={record.isCanceled || record.result}
                >
                  <BsPencilFill />
                </button>
              ))}

            {user?.roleID === "Admin" &&
              (record.result || record.isCanceled ? (
                <Tooltip title="View Detail">
                  <button
                    onClick={() => handleViewDetail(record)}
                    className="bg-[#5bc0de] border-[#46b8da]"
                  >
                    <MdViewWeek />
                  </button>
                </Tooltip>
              ) : moment().isBefore(
                  moment(record.matchDate).add(
                    settings?.timeUpdateScore,
                    "minutes"
                  )
                ) ? (
                <button
                  onClick={() => handleUpdateScore(record)}
                  className="bg-[#5cb85c] border-[#4cae4c]"
                  disabled={moment().isBefore(
                    moment(record.matchDate).add(
                      settings?.timeUpdateScore,
                      "minutes"
                    )
                  )}
                >
                  <TiTick />
                </button>
              ) : (
                <Tooltip title="Update Score">
                  <button
                    onClick={() => handleUpdateScore(record)}
                    className="bg-[#5cb85c] border-[#4cae4c]"
                  >
                    <TiTick />
                  </button>
                </Tooltip>
              ))}

            {user?.roleID === "Admin" &&
              (!bets?.some(
                (bet) => bet?.match?._id.toString() === record?._id
              ) ? (
                <Tooltip title="Delete this match">
                  <button
                    disabled={bets?.some(
                      (bet) => bet?.match?._id?.toString() === record?._id
                    )}
                    onClick={() =>
                      handleDelete(
                        record?._id,
                        record?.team1?.fullName,
                        record?.team2?.fullName
                      )
                    }
                    className="bg-[#d9534f] border-[#d43f3a]"
                  >
                    <CgClose />
                  </button>
                </Tooltip>
              ) : (
                <button
                  disabled={bets?.some(
                    (bet) => bet?.match?._id?.toString() === record?._id
                  )}
                  onClick={() =>
                    handleDelete(
                      record?._id,
                      record?.team1?.fullName,
                      record?.team2?.fullName
                    )
                  }
                  className="bg-[#d9534f] border-[#d43f3a]"
                >
                  <CgClose />
                </button>
              ))}
          </div>

          <div className="flex items-center gap-2">
            {user?.roleID === "Admin" && (
              <Tooltip title={`${record.isShow ? "Hide" : "Show"} this match`}>
                <button
                  onClick={() => handleHide(record)}
                  className={`${
                    record.isShow
                      ? "bg-[#f0ad4e] border-[#eea236]"
                      : "bg-[#5bc0de] border-[#46b8da]"
                  }`}
                >
                  {record.isShow ? <BsEyeSlashFill /> : <IoEyeSharp />}
                </button>
              </Tooltip>
            )}

            {user?.roleID === "Admin" &&
              !record.isCanceled &&
              !record.result && (
                <Tooltip title="Withdraw this match">
                  <button
                    onClick={() => handleWithdraw(record._id)}
                    className="bg-[#d9534f] border-[#d43f3a]"
                  >
                    <BsCloudMinusFill />
                  </button>
                </Tooltip>
              )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchesRoutes} />

      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Action */}
      {user?.roleID === "Admin" && (
        <div className="action-details mb-[10px] flex items-center justify-end gap-1">
          <Link to="/matches/create">Create Match</Link>
        </div>
      )}

      {/* Number of rows */}
      <NumberOfRows>
        {[...matches?.matches]?.filter((match) =>
          user?.roleID === "Admin" ? match : match.isShow
        ).length < 1 ? (
          "No result found"
        ) : (
          <span>
            Total{" "}
            <span className="font-bold">
              {[...matches?.matches]?.filter((match) =>
                user?.roleID === "Admin" ? match : match.isShow
              ).length < 20
                ? [...matches.matches]?.filter((match) =>
                    user?.roleID === "Admin" ? match : match.isShow
                  ).length
                : 20}
            </span>{" "}
            match
            {[...matches.matches]?.filter((match) =>
              user?.roleID === "Admin" ? match : match.isShow
            ).length > 1
              ? "es"
              : ""}
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={
          matches?.matches &&
          [...matches?.matches]
            ?.filter((match) =>
              user?.roleID === "Admin" ? match : match.isShow
            )
            ?.sort((a, b) => moment(a.matchDate) - moment(b.matchDate))
        }
        rowClassName={(record) => !record.isShow && "disabled-row"}
        loading={!matches?.matches}
        scroll={{ x: "100vw" }}
        pagination={{ pageSize: 20 }}
      />

      {/* Delete match modal */}
      <Modals
        title="Delete match"
        open={open}
        confirmLoading={confirmLoading}
        content={`Are you sure you want to delete the match between ${
          deleteMatch.team1 ? deleteMatch.team1 : "Team 1"
        } and ${deleteMatch.team2 ? deleteMatch.team2 : "Team 2"}?`}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />

      {/* Hide match modal */}
      <Modals
        title={`${record.isShow ? "Hide" : "Show"} match`}
        open={openHide}
        confirmLoading={confirmLoadingHide}
        content={`Are you sure you want to ${
          record.isShow ? "hide" : "show"
        } the match between ${record?.team1?.fullName} and ${
          record?.team2?.fullName
        }?`}
        handleOk={handleOkHide}
        handleCancel={handleCancelHide}
      />

      {/* Delete bet modal */}
      <Modals
        title="Delete bet"
        open={openDeleteBet}
        confirmLoading={confirmLoadingDeleteBet}
        content="Are you sure you want to delete this bet?"
        handleOk={handleOkDeleteBet}
        handleCancel={handleCancelDeleteBet}
      />

      {/* Withdraw bet modal */}
      <Modals
        title="Withdraw match"
        open={openWithdrawMatch}
        confirmLoading={confirmLoadingWithdrawMatch}
        content="This action will affect all related bets!!! Are you sure you want to WITHDRAW this match?"
        handleOk={handleOkWithdrawMatch}
        handleCancel={handleCancelWithdrawMatch}
      />
    </div>
  );
};

export default Matches;
