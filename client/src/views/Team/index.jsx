import { Image, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { teamRoutes } from "../../constants";
import { getAllTeamsReducerAsync, selectTeam } from "../../state/teamSlice";
import { selectUser } from "../../state/userSlice";

const Team = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);
  // Get teams from global state
  const { teams } = useSelector(selectTeam);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial state
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Get all teams
  useEffect(() => {
    dispatch(getAllTeamsReducerAsync());
  }, [dispatch]);

  // Handle update team
  const handleUpdateTeam = (_id) => {
    setIsUpdated(true);

    try {
      setIsUpdated(false);
    } catch (error) {
      setIsUpdated(false);
    }
  };

  // Handle delete team
  const handleDeleteTeam = (_id) => {
    setIsDeleted(true);

    try {
      setIsDeleted(false);
    } catch (error) {
      setIsDeleted(false);
    }
  };

  // Columns for table
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <span className="flex items-center justify-center">{index + 1}</span>
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
      onFilter: (value, record) => record.fullName.indexOf(value) === 0,
      render: (text) => (
        <span className="flex items-center justify-center">{text}</span>
      ),
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      render: (text, record) => (
        <div className="flex items-center justify-center w-full">
          <Image src={text} width={50} preview={false} alt={record.fullName} />
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      width: 50,
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Link
            to={`${record._id}/update`}
            onClick={() => handleUpdateTeam(record._id)}
          >
            {isUpdated ? (
              <div className="bg-[orange] w-8 h-8 flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-white" />
              </div>
            ) : (
              <BsPencilFill className="bg-[orange]" />
            )}
          </Link>

          <button onClick={() => handleDeleteTeam(record._id)}>
            {isDeleted ? (
              <div className="bg-[orange] w-8 h-8 flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-white" />
              </div>
            ) : (
              <BsTrashFill className="bg-[red]" />
            )}
          </button>
        </div>
      ),
    },
  ];

  // Check if user role ID is difference Admin back to home page
  if (user?.roleID !== "Admin") return <Navigate to="/" />;

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

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={teams.teams}
        onChange={onChange}
      />
    </div>
  );
};

export default Team;
