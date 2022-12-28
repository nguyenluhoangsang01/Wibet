import { Button, Image, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { headers } from "../../constants";
import { capitalize, formatTime } from "../../helper";
import { deleteMatchReducerAsync } from "../../state/matchSlice";

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
        const { data } = await axios.get(`/match/${id}`, { headers });

        if (data) {
          setMatch(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);

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
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      await dispatch(deleteMatchReducerAsync(match._id));

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
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={matchViewDetails} key={match?._id} />

      {/* Heading */}
      <h1 className="mb-6 font-bold uppercase text-3xl flex items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team1?.flag}
            width={140}
            preview={false}
            alt={match?.team1?.fullName}
            className="border-4 border-[#DFDFDF] p-2 rounded-md overflow-hidden"
          />
          <span>{match?.team1?.fullName}</span>
        </div>
        <span>-</span>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={match?.team2?.flag}
            width={140}
            preview={false}
            alt={match?.team2?.fullName}
            className="border-4 border-[#DFDFDF] p-2 rounded-md overflow-hidden"
          />
          <span>{match?.team2?.fullName}</span>
        </div>
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6 action-details">
        <button onClick={handleMatch} className="bg-[red] text-white">
          Delete
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full group">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{match?._id}</td>
          </tr>
          <tr>
            <th>Team 1</th>
            <td>{match?.team1?.fullName}</td>
          </tr>
          <tr>
            <th>Team 2</th>
            <td>{match?.team2?.fullName}</td>
          </tr>
          <tr>
            <th>Team 1 Score</th>
            <td>
              {match?.resultOfTeam1 ? (
                match?.resultOfTeam1
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Team 2 Score</th>
            <td>
              {match?.resultOfTeam2 ? (
                match?.resultOfTeam2
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
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Match Date</th>
            <td>{formatTime(match?.matchDate)}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>
              {match?.description ? (
                match?.description
              ) : (
                <span className="text-[red] italic">(not set)</span>
              )}
            </td>
          </tr>
          <tr>
            <th>Created Time</th>
            <td>{formatTime(match?.createdAt)}</td>
          </tr>
          <tr>
            <th>Modified Time</th>
            <td>{formatTime(match?.updatedAt)}</td>
          </tr>
        </tbody>
      </table>

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
            {match?.team1?.fullName ? match?.team1?.fullName : "Team 1"}
          </span>{" "}
          and{" "}
          <span className="capitalize font-bold">
            {match?.team2?.fullName ? match?.team2?.fullName : "Team 2"}
          </span>
          ?
        </p>
      </Modal>
    </div>
  );
};

export default MatchViewDetails;