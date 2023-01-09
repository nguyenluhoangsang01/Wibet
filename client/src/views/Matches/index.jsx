import { Image, Table } from "antd";
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
import ModalDeleteBet from "../../components/ModalDeleteBet";
import ModalDeleteMatch from "../../components/ModalDeleteMatch";
import ModalHideMatch from "../../components/ModalHideMatch";
import ModalWithdraw from "../../components/ModalWithdraw";
import NumberOfRows from "../../components/NumberOfRows";
import { matchesRoutes } from "../../constants";
import { capitalize, formatNumber, headers } from "../../helper";
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
  // Initial navigate
  const navigate = useNavigate();
  // Ten minutes after
  const tenMinutesLater = moment().add(10, "minutes");

  // Get all matches
  useEffect(() => {
    dispatch(getAllMatchesReducerAsync(accessToken));
  }, [accessToken, dispatch]);

  // Get all bets
  useEffect(() => {
    dispatch(getAllBetsReducerAsync(accessToken));
  }, [accessToken, dispatch]);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

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
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      await dispatch(deleteMatchReducerAsync(accessToken, deleteMatch._id));

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
        await dispatch(getAllMatchesReducerAsync(accessToken));
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
        await dispatch(getAllBetsReducerAsync(accessToken));

        await dispatch(getAllMatchesReducerAsync(accessToken));

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
      dataIndex: "index",
      key: "index",
      width: "1%",
      render: (text, record) => (
        <p className="font-[calibri] text-[18px]">
          {[...matches.matches].reverse().indexOf(record) + 1}
        </p>
      ),
    },
    {
      title: "Team 1",
      dataIndex: "team1",
      key: "team1",
      width: "1%",
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
      width: "1%",
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
      width: "1%",
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
      width: "1%",
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
      width: "1%",
      render: (text) => <span>0:{formatNumber(text)}</span>,
    },
    {
      title: "Match Date",
      dataIndex: "matchDate",
      key: "matchDate",
      width: "1%",
      render: (text) => (
        <span title={text}>
          {moment(text).format("MMM Do YYYY, h:mm:ss a")}
        </span>
      ),
    },
    {
      title: "After Rate",
      dataIndex: "rate",
      key: "rate",
      width: "1%",
      render: (text, record) =>
        record.isCanceled ? (
          <span className="bg-[#6c757d] rounded-full gap-1 text-white text-[16px] font-bold font-[calibri] px-4">
            Canceled
          </span>
        ) : (
          <span>
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
            }] ${record?.team2?.name}`}
          </span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "1%",
      render: (text, record) => (
        <span>{`${record.statusOfTeam1} / ${record.statusOfTeam2}`}</span>
      ),
    },
    {
      title: "Your Bet",
      dataIndex: "bet-action",
      key: "bet-action",
      width: "1%",
      render: (text, record) =>
        record.result || moment(record.matchDate).isBefore(tenMinutesLater) ? (
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
                    .filter(
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
                      className="bg-[#28a745] flex items-center justify-center rounded-full px-[10px] gap-1"
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
      render: (text, record) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleViewAllBet(record)}
              className="bg-[#222222]"
            >
              <FaShare />
            </button>

            {user?.roleID === "Admin" && (
              <button
                onClick={() => handleUpdateInfo(record)}
                className="bg-[#f0ad4e]"
                disabled={record.isCanceled || record.result}
              >
                <BsPencilFill />
              </button>
            )}

            {user?.roleID === "Admin" &&
              (record.result || record.isCanceled ? (
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
              ))}

            {user?.roleID === "Admin" && (
              <button
                disabled={bets.some(
                  (bet) => bet.match._id.toString() === record._id
                )}
                onClick={() =>
                  handleDelete(
                    record._id,
                    record?.team1?.fullName,
                    record?.team2?.fullName
                  )
                }
                className="bg-[#d9534f]"
              >
                <CgClose />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user?.roleID === "Admin" && (
              <button
                onClick={() => handleHide(record)}
                className={`${record.isShow ? "bg-[#f0ad4e]" : "bg-[#5bc0de]"}`}
              >
                {record.isShow ? <BsEyeSlashFill /> : <IoEyeSharp />}
              </button>
            )}

            {user?.roleID === "Admin" &&
              !record.isCanceled &&
              !record.result && (
                <button
                  onClick={() => handleWithdraw(record._id)}
                  className="bg-[#d2322d]"
                >
                  <BsCloudMinusFill />
                </button>
              )}
          </div>
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
      {user?.roleID === "Admin" && (
        <div className="action-details mb-[10px] flex items-center justify-end gap-1">
          <Link to="/matches/create">Create Match</Link>
        </div>
      )}

      {/* Number of rows */}
      <NumberOfRows>
        Showing{" "}
        <span className="font-bold">
          1-
          {[...matches.matches]?.filter((match) =>
            user?.roleID === "Admin" ? match : match.isShow === true
          ).length < 10
            ? [...matches.matches]?.filter((match) =>
                user?.roleID === "Admin" ? match : match.isShow === true
              ).length
            : 10}
        </span>{" "}
        of{" "}
        <span className="font-bold">
          {
            [...matches.matches]?.filter((match) =>
              user?.roleID === "Admin" ? match : match.isShow === true
            ).length
          }
        </span>{" "}
        item
        {[...matches.matches]?.filter((match) =>
          user?.roleID === "Admin" ? match : match.isShow === true
        ).length > 1
          ? "s"
          : ""}
        .
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={[...matches.matches]
          ?.filter((match) =>
            user?.roleID === "Admin" ? match : match.isShow === true
          )
          ?.reverse()}
        rowClassName={(record) => !record.isShow && "disabled-row"}
        loading={matches.matches ? false : true}
        scroll={{ x: "90vw" }}
      />

      {/* Delete Modal */}
      <ModalDeleteMatch
        open={open}
        confirmLoading={confirmLoading}
        match={deleteMatch}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />

      {/* Hide Modal */}
      <ModalHideMatch
        open={openHide}
        confirmLoading={confirmLoadingHide}
        match={record}
        handleOk={handleOkHide}
        handleCancel={handleCancelHide}
      />

      {/* Delete Bet Modal */}
      <ModalDeleteBet
        open={openDeleteBet}
        confirmLoading={confirmLoadingDeleteBet}
        handleOk={handleOkDeleteBet}
        handleCancel={handleCancelDeleteBet}
      />

      {/* Withdraw Bet Modal */}
      <ModalWithdraw
        open={openWithdrawMatch}
        confirmLoading={confirmLoadingWithdrawMatch}
        handleOk={handleOkWithdrawMatch}
        handleCancel={handleCancelWithdrawMatch}
      />
    </div>
  );
};

export default Matches;
