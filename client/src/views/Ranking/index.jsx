import { Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import NumberOfRows from "../../components/NumberOfRows";
import { rankingRoutes } from "../../constants";
import { capitalize } from "../../helper";
import { getAllUsersReducer, selectUser } from "../../state/userSlice";

const Ranking = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { users, isShowHistory, accessToken, user } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();
  // Initial state
  const [isShow, setIsShow] = useState(false);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Get all users
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/user");

        if (data) {
          dispatch(getAllUsersReducer(data));

          setIsShow(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllUsersReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  if (!isShow) return <span>Loading...</span>;

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
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {index + 1}
        </span>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <Tooltip title={text}>
          <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) =>
        text ? (
          <Tooltip title={text}>
            <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
              {text}
            </span>
          </Tooltip>
        ) : (
          <span className="text-[red] italic">(not set)</span>
        ),
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      render: (text, record) => (
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Bet Times",
      dataIndex: "betTimes",
      key: "betTimes",
      render: (text, record) => (
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Win Times",
      dataIndex: "winTimes",
      key: "winTimes",
      render: (text, record) => (
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Bet Money",
      dataIndex: "betMoney",
      key: "betMoney",
      render: (text, record) => (
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {text}
        </span>
      ),
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (text, record) => (
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {((record?.winTimes / record?.betTimes) * 100).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) => (
        <span className={`${record?._id === user?._id ? "font-bold" : ""}`}>
          {record?.money + record?.betMoney}
        </span>
      ),
    },
    {
      title: "-",
      dataIndex: "actions",
      render: (text, record) =>
        isShowHistory &&
        user && (
          <div className="flex items-center justify-center">
            <Tooltip title="View info">
              <button
                onClick={() => handleTracking(record?._id)}
                className="bg-[#5bc0de]"
              >
                <FaShare />
              </button>
            </Tooltip>
          </div>
        ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
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
            user
            {[...users?.users].filter((user) => user.betTimes > 0).length > 1
              ? "s"
              : ""}
          </span>
        )}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={
          users?.users &&
          [...users?.users]
            .filter((user) => user.betTimes > 0)
            .sort((a, b) => a.money - b.money)
            .reverse()
        }
        loading={!users?.users}
        scroll={{ x: "80vw" }}
        pagination={false}
      />
    </div>
  );
};

export default Ranking;
