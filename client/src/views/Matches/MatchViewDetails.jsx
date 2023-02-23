import { Image, Tooltip } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Modals from "../../components/Modals";
import { formatTime } from "../../constants";
import { capitalize, headers } from "../../helper";
import { deleteMatchReducerAsync } from "../../state/matchSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const MatchViewDetails = () => {
  // Get match id from request params
  const { id } = useParams();
  // Initial state
  const [match, setMatch] = useState({});
  // Initial state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role id not equal Admin
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/matches");
  }, [navigate, user?.roleID]);

  // Set title
  useEffect(() => {
    document.title = `${capitalize(match?.team1?.fullName)} - ${capitalize(
      match?.team2?.fullName
    )}`;
  });

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
        if (response) {
          dispatch(logoutReducerAsync(accessToken));

          navigate("/matches");
        }
      }
    })();
  }, [accessToken, dispatch, id, navigate]);

  // Breadcrumbs
  const matchViewDetails = [
    {
      path: "/",
      name: "home",
    },
    {
      path: "/matches",
      name: "matches",
    },
    {
      path: "",
      name: `${match?.team1?.fullName} - ${match?.team2?.fullName}` || "key",
    },
  ];

  // Handle delete match
  const handleMatch = () => {
    // Open modal when user click trash icon
    setOpen(true);
  };

  // Handle confirm ok when user delete
  const handleOk = () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      dispatch(deleteMatchReducerAsync(accessToken, match._id));

      // After set loading to false
      setConfirmLoading(false);

      // Delete successfully hide modal
      setOpen(false);

      // And navigate
      navigate("/matches");
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

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchViewDetails} key={match?._id} />

      {/* Heading */}
      <h1 className="capitalize text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] flex items-center gap-4 flex-col md:flex-row text-[#333]">
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
      </h1>

      {/* Actions */}
      {!match.isCanceled && (
        <div className="flex items-center gap-4 mb-6 action-details mt-6">
          <button onClick={handleMatch} className="!bg-[#d2322d]">
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <table className="table-auto w-full table-view-details">
        <tbody>
          <tr>
            <th>ID</th>
            <Tooltip title={match?._id}>
              <td>{match?._id}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Team 1</th>
            <Tooltip title={match?.team1?.fullName}>
              <td>{match?.team1?.fullName}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Team 2</th>
            <Tooltip title={match?.team2?.fullName}>
              <td>{match?.team2?.fullName}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Team 1 Score</th>
            <td>
              {match?.resultOfTeam1 ? (
                <Tooltip title={match?.resultOfTeam1}>
                  {match?.resultOfTeam1}
                </Tooltip>
              ) : match?.resultOfTeam1 === 0 ? (
                "0"
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Team 2 Score</th>
            <td>
              {match?.resultOfTeam2 ? (
                <Tooltip title={match?.resultOfTeam2}>
                  {match?.resultOfTeam2}
                </Tooltip>
              ) : match?.resultOfTeam2 === 0 ? (
                "0"
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Rate</th>
            <td>{match?.rate}</td>
          </tr>
          <tr>
            <th>Result</th>
            <td>
              {match?.result ? (
                match?.result
              ) : match.isCanceled ? (
                <span className="bg-[#6c757d] rounded-full gap-1 text-white text-[16px] font-bold font-[calibri] px-4">
                  Canceled
                </span>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Match Date</th>
            <Tooltip title={moment(match?.matchDate).format(formatTime)}>
              <td>{moment(match?.matchDate).format(formatTime)}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Description</th>
            <td>
              {match?.description ? (
                <Tooltip title={match?.description}>
                  <span>{match?.description}</span>
                </Tooltip>
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Created Time</th>
            <Tooltip title={moment(match?.createdAt).format(formatTime)}>
              <td>{moment(match?.createdAt).format(formatTime)}</td>
            </Tooltip>
          </tr>
          <tr>
            <th>Modified Time</th>
            <Tooltip title={moment(match?.updatedAt).format(formatTime)}>
              <td>{moment(match?.updatedAt).format(formatTime)}</td>
            </Tooltip>
          </tr>
        </tbody>
      </table>

      {/* Delete match modal */}
      <Modals
        title="Delete match"
        open={open}
        confirmLoading={confirmLoading}
        content={`Are you sure you want to delete the match between ${
          match.team1 ? match.team1 : "Team 1"
        } and ${match.team2 ? match.team2 : "Team 2"}?`}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default MatchViewDetails;
