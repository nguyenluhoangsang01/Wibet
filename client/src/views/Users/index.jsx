import { Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { usersRoutes } from "../../constants";
import { getAllUsersReducerAsync, selectUser } from "../../state/userSlice";

const columns = [
  {
    title: "#",
    dataIndex: "_id",
    key: "_id",
    render: (text, record, index) => (
      <span className="flex items-center justify-center">{index + 1}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
    ),
  },
  {
    title: "Logged In At",
    dataIndex: "loggedInAt",
    key: "loggedInAt",
    sorter: (a, b) => {
      if (a.loggedInAt < b.loggedInAt) return -1;
      if (a.loggedInAt > b.loggedInAt) return 1;
    },
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
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
    render: (text) => (
      <span className="flex items-center justify-center">{text}</span>
    ),
  },
  {
    title: "",
    dataIndex: "",
  },
];

const Users = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user, users } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();

  // Get all users
  useEffect(() => {
    dispatch(getAllUsersReducerAsync());
  }, [dispatch]);

  // Check if user role ID is difference Admin back to home page
  if (user?.roleID !== "Admin") return <Navigate to="/" />;

  // Handle on table change
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={usersRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users.users}
        onChange={onChange}
      />
    </div>
  );
};

export default Users;
