import { Table } from "antd";
import React, { useEffect } from "react";
import { FaShare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import NumberOfRows from "../../components/NumberOfRows";
import { rankingRoutes } from "../../constants";
import { capitalize } from "../../helper";
import { getAllUsersReducerAsync, selectUser } from "../../state/userSlice";

const Ranking = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { users, isShowHistory, accessToken, user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all users
  useEffect(() => {
    dispatch(getAllUsersReducerAsync());
  }, [accessToken, dispatch]);

  // Handle tracking
  const handleTracking = async (id) => {
    navigate(`/ranking/${id}`);
  };

  // Columns for table
  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <span className={`${text === user._id ? "font-bold" : ""}`}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <span className={`${text === user.username ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) =>
        text ? (
          <span className={`${text === user.fullName ? "font-bold" : ""}`}>
            {text}
          </span>
        ) : (
          <span className="text-[red] italic">(not set)</span>
        ),
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      render: (text) => (
        <span className={`${text === user.money ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Bet Times",
      dataIndex: "betTimes",
      key: "betTimes",
      render: (text) => (
        <span className={`${text === user.betTimes ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Win Times",
      dataIndex: "winTimes",
      key: "winTimes",
      render: (text) => (
        <span className={`${text === user.winTimes ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Bet Money",
      dataIndex: "betMoney",
      key: "betMoney",
      render: (text) => (
        <span className={`${text === user.betMoney ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (text, record) => (
        <span
          className={`${
            ((record.winTimes / record.betTimes) * 100).toFixed(2) ===
            ((user.winTimes / user.betTimes) * 100).toFixed(2)
              ? "font-bold"
              : ""
          }`}
        >
          {((record.winTimes / record.betTimes) * 100).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) => (
        <span
          className={`${
            record.money + record.betMoney === user.money + user.betMoney
              ? "font-bold"
              : ""
          }`}
        >
          {record.money + record.betMoney}
        </span>
      ),
    },
    {
      title: "-",
      dataIndex: "actions",
      render: (text, record) =>
        isShowHistory && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleTracking(record._id)}
              className="bg-[#5bc0de]"
            >
              <FaShare />
            </button>
          </div>
        ),
    },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={rankingRoutes} />

      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Number of rows */}
      <NumberOfRows>
        {[...users?.users].filter((user) => user.betTimes > 0) < 1 ? (
          "No result found"
        ) : (
          <span>
            Total{" "}
            <span className="font-bold">
              {[...users?.users].filter((user) => user.betTimes > 0).length}
            </span>{" "}
            item
            {[...users?.users].filter((user) => user.betTimes > 0).length > 1
              ? "s"
              : ""}
            .
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={[...users?.users]
          .filter((user) => user.betTimes > 0)
          .sort((a, b) => a.money - b.money)
          .reverse()}
        loading={users?.users ? false : true}
        scroll={{ x: "90vw" }}
        pagination={false}
      />
    </div>
  );
};

export default Ranking;
