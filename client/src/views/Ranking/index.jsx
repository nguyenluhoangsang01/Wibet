import { Table } from "antd";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import NumberOfRows from "../../components/NumberOfRows";
import { rankingRoutes } from "../../constants";
import { capitalize } from "../../helper";

const Ranking = () => {
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

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
      render: (text) => <span>{text}</span>,
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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      dataIndex: "actions",
      render: (text, record) => <div>tracking</div>,
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
        {/* Showing{" "}
        <span className="font-bold">
          1-{teams.length < 10 ? teams.length : 10}
        </span>{" "}
        of <span className="font-bold">{teams.length}</span> team
        {teams.length > 1 ? "s" : ""}. */}
      </NumberOfRows>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        // dataSource={[...teams?.teams].reverse()}
      />
    </div>
  );
};

export default Ranking;
