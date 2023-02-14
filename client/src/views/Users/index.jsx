import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { GiReceiveMoney } from "react-icons/gi";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import ModalDeleteUser from "../../components/ModalDeleteUser";
import NumberOfRows from "../../components/NumberOfRows";
import { usersRoutes } from "../../constants";
import { capitalize } from "../../helper";
import {
  deleteUserReducerAsync,
  getAllUsersReducerAsync,
  selectUser,
  toggleIsShowHistory,
} from "../../state/userSlice";

const Users = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user, users, is show history form global state
  const { user, users, isShowHistory, accessToken } = useSelector(selectUser);
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
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all users
  useEffect(() => {
    dispatch(getAllUsersReducerAsync());
  }, [accessToken, dispatch]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  if (!isShow) return null;

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
      await dispatch(deleteUserReducerAsync(accessToken, deleteUser._id));

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
    navigate(`/users/${record._id}/update`);
  };

  // Handle update user'money
  const handleUpdateUserMoney = (record) => {
    navigate(`/users/${record._id}/update/money`);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record) => (
        <span className={record?._id === user?._id ? "font-bold" : ""}>
          {[...users?.users].reverse().indexOf(record) + 1}
        </span>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
      },
      render: (text, record) => (
        <Tooltip title={text}>
          <span className={record?._id === user?._id ? "font-bold" : ""}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "roleID",
      key: "roleID",
      sorter: (a, b) => {
        if (a.roleID < b.roleID) return -1;
        if (a.roleID > b.roleID) return 1;
      },
      render: (text, record) => (
        <span className={record?._id === user?._id ? "font-bold" : ""}>
          {text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        if (a.status < b.status) return -1;
        if (a.status > b.status) return 1;
      },
      render: (text, record) => (
        <span className={record?._id === user?._id ? "font-bold" : ""}>
          {text}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => {
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
      },
      render: (text, record) => (
        <Tooltip title={text}>
          <span className={record?._id === user?._id ? "font-bold" : ""}>
            <a
              href={`mailto:${text}`}
              className="text-[#2A6496] transition hover:underline"
            >
              {text}
            </a>
          </span>
        </Tooltip>
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
      render: (text, record) =>
        text ? (
          <Tooltip title={text}>
            <span className={record?._id === user?._id ? "font-bold" : ""}>
              {text}
            </span>
          </Tooltip>
        ) : (
          <span
            className={
              record?._id === user?._id
                ? "font-bold text-[red] italic"
                : "text-[red] italic"
            }
          >
            (not set)
          </span>
        ),
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      render: (text, record) => (
        <span className={record?._id === user?._id ? "font-bold" : ""}>
          {text}
        </span>
      ),
    },
    {
      title: "Logged In At",
      dataIndex: "loggedInAt",
      key: "loggedInAt",
      render: (text, record) =>
        text ? (
          <Tooltip title={text}>
            <span className={record?._id === user?._id ? "font-bold" : ""}>
              {text}
            </span>
          </Tooltip>
        ) : (
          <span
            className={
              record?._id === user?._id
                ? "font-bold text-[red] italic"
                : "text-[red] italic"
            }
          >
            (not set)
          </span>
        ),
    },
    {
      title: "Banned At",
      dataIndex: "bannedAt",
      key: "bannedAt",
      render: (text, record) =>
        Boolean(record.bannedAt) ? (
          record.bannedAt === "false" ? (
            <span
              className={
                record?._id === user?._id
                  ? "font-bold text-[red] italic"
                  : "text-[red] italic"
              }
            >
              (not set)
            </span>
          ) : (
            <Tooltip title={record.bannedAt}>
              <span className={record?._id === user?._id ? "font-bold" : ""}>
                {record.bannedAt}
              </span>
            </Tooltip>
          )
        ) : (
          <span
            className={
              record?._id === user?._id
                ? "font-bold text-[red] italic"
                : "text-[red] italic"
            }
          >
            (not set)
          </span>
        ),
    },
    {
      title: "-",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <Tooltip title="View">
            <Link to={`${record._id}/view-details`}>
              <IoEyeSharp className="text-[#428bca]" />
            </Link>
          </Tooltip>

          <Tooltip title="Update Information">
            <button onClick={() => handleUpdateUser(record)}>
              <BsPencilFill className="text-[#428bca]" />
            </button>
          </Tooltip>

          <Tooltip title="Add Money">
            <button onClick={() => handleUpdateUserMoney(record)}>
              <GiReceiveMoney className="text-[#428bca]" />
            </button>
          </Tooltip>

          {record?._id !== user?._id ? (
            <Tooltip title="Delete">
              <button
                onClick={() => handleDeleteUser(record?._id, record?.username)}
              >
                <BsTrashFill className="text-[#428bca]" />
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={() => handleDeleteUser(record?._id, record?.username)}
              disabled={record?._id === user?._id}
            >
              <BsTrashFill className="text-[#428bca]" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Handle show history
  const handleShowHistory = () => {
    dispatch(toggleIsShowHistory());
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={usersRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Actions */}
      <div className="action-details mb-[10px] flex items-center justify-end gap-1">
        <Link to="/users/create">Create User</Link>
        <button onClick={handleShowHistory}>
          {isShowHistory ? "Hide" : "Show"} history
        </button>
      </div>

      {/* Number of rows */}
      <NumberOfRows>
        {[...users?.users]?.length < 1 ? (
          "No result found"
        ) : (
          <span>
            Showing{" "}
            <span className="font-bold">
              1-
              {[...users?.users]?.length < 20 ? [...users?.users]?.length : 20}
            </span>{" "}
            of <span className="font-bold">{[...users?.users]?.length}</span>{" "}
            item
            {[...users?.users]?.length > 1 ? "s" : ""}.
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={[...users?.users].reverse()}
        loading={[...users?.users] ? false : true}
        scroll={{ x: "90vw" }}
        pagination={{ pageSize: 20 }}
      />

      {/* Modal */}
      <ModalDeleteUser
        open={open}
        confirmLoading={confirmLoading}
        user={deleteUser}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Users;
