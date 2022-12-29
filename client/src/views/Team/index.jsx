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
      fixed: "left",
      render: (text, record, index) => (
        <p className="text-center">{index + 1}</p>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      render: (text) => <span className="text-center">{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => {
        if (a.fullName < b.fullName) return -1;
        if (a.fullName > b.fullName) return 1;
      },
      onFilter: (value, record) => record.fullName.indexOf(value) === 0,
      render: (text) => <span className="text-center">{text}</span>,
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      render: (text, record) => (
        <div className="flex items-center justify-center w-full h-full">
          <Image src={text} width={50} preview={false} alt={record.fullName} />
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleUpdateTeam(record)}>
            <BsPencilFill className="bg-[#F0AD4E]" />
          </button>

          <button onClick={() => handleDeleteTeam(record._id, record.fullName)}>
            <BsTrashFill className="bg-[#D9534F]" />
          </button>
        </div>
      ),
    },
  ];

  // Handle on table change
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={teamRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      <div className="md:flex items-center justify-between mb-6">
        <p className="flex items-center justify-center gap-1 mb-2 md:mb-0">
          Showing{" "}
          <span className="font-bold">
            1-{teams.length < 10 ? teams.length : 10}
          </span>{" "}
          of <span className="font-bold">{teams.length}</span> team
          {teams.length > 1 ? "s" : ""}.
        </p>

        <div className="flex items-center justify-between gap-4 action-details">
          <button
            onClick={handleImportExcel}
            className="bg-[#5CB85C] text-white"
          >
            Import Excel
          </button>
          <Link to="/teams/create" className="bg-black text-white">
            Create Team
          </Link>
        </div>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={teams?.teams}
        onChange={onChange}
      />

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
