import { Button, Image, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { teamRoutes } from "../../constants";
import { capitalize } from "../../helper";
import {
  deleteTeamReducerAsync,
  getAllTeamsReducerAsync,
  selectTeam,
} from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const Team = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get teams from global state
  const { teams } = useSelector(selectTeam);
  // Get user from global state
  const { user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState({
    _id: "",
    fullName: "",
  });

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all teams
  useEffect(() => {
    dispatch(getAllTeamsReducerAsync());
  }, [dispatch]);

  // Check if user role ID is difference Admin back to home page
  if (user?.roleID !== "Admin") return <Navigate to="/" />;

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      await dispatch(deleteTeamReducerAsync(deleteTeam._id));

      // After delete successfully hide modal
      setOpen(false);

      // And set loading to false
      setConfirmLoading(false);
    } catch (error) {
      // Set loading to false if have error
      setConfirmLoading(false);

      // After delete successfully hide modal
      setOpen(false);
    }
  };

  // Handle import excel
  const handleImportExcel = () => {
    console.log("handleImportExcel");
  };

  // Handle cancel when user no delete
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle update team
  const handleUpdateTeam = (record) => {
    navigate(`/teams/${record._id}/update`, {
      state: {
        team: record,
      },
    });
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
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => {
        if (a.fullName < b.fullName) return -1;
        if (a.fullName > b.fullName) return 1;
      },
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
            width={50}
            preview={false}
            alt={record.fullName}
            className="shadow-xl"
          />
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (text, record) => (
        <div>
          <button
            onClick={() => handleUpdateTeam(record)}
            className="bg-[#f0ad4e] border-[#eea236]"
          >
            <BsPencilFill />
          </button>

          <button
            onClick={() => handleDeleteTeam(record._id, record.fullName)}
            className="bg-[#d9534f] border-[#d43f3a]"
          >
            <BsTrashFill />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={teamRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Actions */}
      <div className="action-details mb-[10px] flex items-center justify-end gap-1">
        <button onClick={handleImportExcel} className="!bg-[#5CB85C]">
          Import Excel
        </button>
        <Link to="/teams/create">Create Team</Link>
      </div>

      {/* Total */}
      <p className="flex items-center gap-1 font-[calibri] text-[18px]">
        Showing{" "}
        <span className="font-bold">
          1-{teams.length < 10 ? teams.length : 10}
        </span>{" "}
        of <span className="font-bold">{teams.length}</span> team
        {teams.length > 1 ? "s" : ""}.
      </p>

      {/* Table */}
      <Table rowKey="_id" columns={columns} dataSource={teams?.teams} />

      {/* Modal */}
      <Modal
        title="Delete team"
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
          Are you sure you want to delete{" "}
          <span className="capitalize font-bold">{deleteTeam.fullName}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default Team;
