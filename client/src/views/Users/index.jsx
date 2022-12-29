import { Button, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { usersRoutes } from "../../constants";
import { capitalize } from "../../helper";
import {
	deleteUserReducerAsync,
	getAllUsersReducerAsync,
	selectUser
} from "../../state/userSlice";

const Users = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user, users } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteUser, setDeleteUser] = useState({
    _id: "",
    username: "",
  });

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all users
  useEffect(() => {
    dispatch(getAllUsersReducerAsync());
  }, [dispatch]);

  // Check if user role ID is difference Admin back to home page
  if (user?.roleID !== "Admin") return <Navigate to="/" />;

  // Handle delete user
  const handleDeleteUser = (_id, username) => {
    // Open modal when user click trash icon
    setOpen(true);
    // Set _id and username
    setDeleteUser({
      _id,
      username,
    });
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      // Dispatch delete user reducer async action
      await dispatch(deleteUserReducerAsync(deleteUser._id));

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

  // Handle cancel when user no delete
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle update user
  const handleUpdateUser = (record) => {
    navigate(`/users/${record._id}/update`, {
      state: {
        user: record,
      },
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "roleID",
      key: "roleID",
      sorter: (a, b) => {
        if (a.roleID < b.roleID) return -1;
        if (a.roleID > b.roleID) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        if (a.status < b.status) return -1;
        if (a.status > b.status) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => {
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
      },
      render: (text) => (
        <a
          href={`mailto:${text}`}
          className="text-[#2A6496] transition hover:underline"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => {
        if (a.fullName < b.fullName) return -1;
        if (a.fullName > b.fullName) return 1;
      },
      render: (text) =>
        text ? (
          <span>{text}</span>
        ) : (
          <span className="text-[red] italic">(not set)</span>
        ),
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      sorter: (a, b) => {
        if (a.money < b.money) return -1;
        if (a.money > b.money) return 1;
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Logged In At",
      dataIndex: "loggedInAt",
      key: "loggedInAt",
      sorter: (a, b) => {
        if (a.loggedInAt < b.loggedInAt) return -1;
        if (a.loggedInAt > b.loggedInAt) return 1;
      },
      render: (text) =>
        text ? (
          <span>{text}</span>
        ) : (
          <span className="text-[red] italic">(not set)</span>
        ),
    },
    {
      title: "Banned At",
      dataIndex: "bannedAt",
      key: "bannedAt",
      sorter: (a, b) => {
        if (a.bannedAt < b.bannedAt) return -1;
        if (a.bannedAt > b.bannedAt) return 1;
      },
      render: (text) =>
        text ? (
          <span>{text}</span>
        ) : (
          <span className="text-[red] italic">(not set)</span>
        ),
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <Link to={`${record._id}/view-details`}>
            <IoEyeSharp className="text-[#428bca]" />
          </Link>

          <button onClick={() => handleUpdateUser(record)}>
            <BsPencilFill className="text-[#428bca]" />
          </button>

          <button onClick={() => handleDeleteUser(record._id, record.username)}>
            <BsTrashFill className="text-[#428bca]" />
          </button>
        </div>
      ),
    },
  ];

  // Handle show history
  const handleShowHistory = () => {
    console.log("handleShowHistory");
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={usersRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Actions */}
      <div className="action-details mb-[10px] flex items-center justify-end gap-1">
        <Link to="/users/create">Create User</Link>
        <button onClick={handleShowHistory}>Show history</button>
      </div>

      {/* Total */}
      <p className="flex items-center gap-1 font-[calibri] text-[18px]">
        Showing{" "}
        <span className="font-bold">
          1-{users.length - 1 < 10 ? users.length - 1 : 10}
        </span>{" "}
        of <span className="font-bold">{users.length - 1}</span> user
        {users.length - 1 > 1 ? "s" : ""}.
      </p>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users.users
          ?.filter((item) => item._id !== user._id)
          .reverse()}
        scroll={{
          x: 1200,
        }}
      />

      {/* Modal */}
      <Modal
        title="Delete user"
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
          <span className="capitalize font-bold">{deleteUser.username}</span>?
        </p>
      </Modal>
    </div>
  );
};

export default Users;
