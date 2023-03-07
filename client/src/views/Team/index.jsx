import { Image, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Modals from "../../components/Modals";
import NumberOfRows from "../../components/NumberOfRows";
import { teamRoutes } from "../../constants";
import { capitalize, headers } from "../../helper";
import { getAllMatchesReducer, selectMatch } from "../../state/matchSlice";
import {
  getAllTeamsReducer,
  selectTeam,
  updateTeamReducer,
} from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const Team = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get teams from global state
  const { teams } = useSelector(selectTeam);
  // Get user from global state
  const { user, accessToken } = useSelector(selectUser);
  // Get all matches from global state
  const {
    matches: { matches },
  } = useSelector(selectMatch);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState({ _id: null, fullName: null });
  const [isShow1, setIsShow1] = useState(false);
  const [isShow2, setIsShow2] = useState(false);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all teams
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/team`, {
          headers: headers(accessToken),
        });

        if (data) {
          dispatch(getAllTeamsReducer(data));

          setIsShow1(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllTeamsReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  // Get all matches
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/match");

        if (data) {
          dispatch(getAllMatchesReducer(data));

          setIsShow2(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllMatchesReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  if (!isShow1 && !isShow2) return <span>Loading...</span>;

  // Handle confirm ok when user delete
  const handleOk = () => {
    // Set loading to true first
    setConfirmLoading(true);

    (async () => {
      try {
        const { data } = await axios.delete(`/team/${deleteTeam._id}`, {
          headers: headers(accessToken),
        });

        if (data) {
          dispatch(updateTeamReducer(data));

          // After delete successfully hide modal
          setOpen(false);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(updateTeamReducer(response.data));

          // And set loading to false
          setConfirmLoading(false);
        }
      }
    })();
  };

  // Handle cancel when user no delete
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle update team
  const handleUpdateTeam = (record) => {
    navigate(`/teams/${record._id}/update`);
  };

  // Handle delete team
  const handleDeleteTeam = (_id, fullName) => {
    // Open modal when user click trash icon
    setOpen(true);
    // Set _id and username
    setDeleteTeam({
      _id,
      fullName,
    });
  };

  // Columns for table
  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      key: "index",
      render: (text, record) => (
        <span>{[...teams.teams].indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      render: (text, record) => (
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src={text}
            width={80}
            alt={record.fullName}
            className="shadow-xl object-cover border-[#FFC107] border-2 rounded"
          />
        </div>
      ),
    },
    {
      title: "-",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <Tooltip title="Update info">
            <button
              onClick={() => handleUpdateTeam(record)}
              className="bg-[#f0ad4e] border-[#eea236]"
            >
              <BsPencilFill />
            </button>
          </Tooltip>

          {!matches?.some(
            (match) =>
              record?._id?.toString() === match?.team1?._id?.toString() ||
              record?._id?.toString() === match?.team2?._id?.toString()
          ) ? (
            <Tooltip title="Delete this team">
              <button
                onClick={() => handleDeleteTeam(record._id, record.fullName)}
                className="bg-[#d9534f] border-[#d43f3a]"
                disabled={matches?.some(
                  (match) =>
                    record?._id?.toString() === match?.team1?._id?.toString() ||
                    record?._id?.toString() === match?.team2?._id?.toString()
                )}
              >
                <CgClose />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={() => handleDeleteTeam(record._id, record.fullName)}
              className="bg-[#d9534f] border-[#d43f3a]"
              disabled={matches?.some(
                (match) =>
                  record?._id?.toString() === match?.team1?._id?.toString() ||
                  record?._id?.toString() === match?.team2?._id?.toString()
              )}
            >
              <CgClose />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={teamRoutes} />

      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Actions */}
      <div className="action-details mb-[10px] flex items-center justify-end gap-1">
        <Link to="/teams/create">Create Team</Link>
      </div>

      {/* Number of rows */}
      <NumberOfRows>
        {teams.length < 1 ? (
          "No result found"
        ) : (
          <span>
            Total <span className="font-bold">{teams.length}</span> team
            {teams.length > 1 ? "s" : ""}
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={
          teams?.teams &&
          [...teams?.teams].sort((a, b) => a.fullName - b.fullName)
        }
        loading={!teams?.teams}
        scroll={{ x: "80vw" }}
        pagination={{ pageSize: 20 }}
      />

      {/* Modal delete team */}
      <Modals
        title="Delete team"
        open={open}
        confirmLoading={confirmLoading}
        content={`Are you sure you want to delete ${deleteTeam.fullName}?`}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Team;
