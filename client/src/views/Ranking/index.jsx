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
  const { users, isShowHistory, accessToken } = useSelector(selectUser);
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
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Bet Times",
      dataIndex: "betTimes",
      key: "betTimes",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Win Times",
      dataIndex: "winTimes",
      key: "winTimes",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Bet Money",
      dataIndex: "betMoney",
      key: "betMoney",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Win Rate",
      dataIndex: "winRate",
      key: "winRate",
      render: (text, record) => (
        <span>{((record.winTimes / record.betTimes) * 100).toFixed(2)}</span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) => <span>{record.money + record.betMoney}</span>,
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
        Showing{" "}
        <span className="font-bold">
          1-{users.length - 1 < 10 ? users.length - 1 : 10}
        </span>{" "}
        of <span className="font-bold">{users.length - 1}</span> user
        {users.length - 1 > 1 ? "s" : ""}.
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
        scroll={{ x: "100vh" }}
      />
    </div>
  );
};

export default Ranking;
