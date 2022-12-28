import { Button, Form, Input, Table } from "antd";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { profileRoutes } from "../../constants";
import { selectUser } from "../../state/userSlice";

const Profile = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Get user form global state
  const { user } = useSelector(selectUser);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);

  // Check if user is null
  if (!user) return <Navigate to="/" />;

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click update button
    setIsFinish(true);

    console.log(values);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      width: 50,
      render: (text, record, index) => (
        <p className="text-center">{index + 1}</p>
      ),
    },
    {
      title: "Team 1 Name",
      dataIndex: "team1",
      key: "team1",
      width: 200,
      sorter: (a, b) => {
        if (a.team1 < b.team1) return -1;
        if (a.team1 > b.team1) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: "Team 2 Name",
      dataIndex: "team2",
      key: "team2",
      width: 200,
      sorter: (a, b) => {
        if (a.team2 < b.team2) return -1;
        if (a.team2 > b.team2) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: 200,
      sorter: (a, b) => {
        if (a.rate < b.rate) return -1;
        if (a.rate > b.rate) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: "Money",
      dataIndex: "money",
      key: "money",
      width: 200,
      sorter: (a, b) => {
        if (a.money < b.money) return -1;
        if (a.money > b.money) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block" title={text}>
          {text}
        </p>
      ),
    },
    {
      title: "Bet result",
      dataIndex: "result",
      key: "result",
      width: 200,
      sorter: (a, b) => {
        if (a.result < b.result) return -1;
        if (a.result > b.result) return 1;
      },
      render: (text) => (
        <p className="text-center truncate block" title={text}>
          {text}
        </p>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={profileRoutes} />
      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      <div className="divide-y-2">
        {/* Form */}
        <Form
          name="login"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 6 }}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ fullName: user.fullName }}
        >
          {/* Full Name input */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Full Name cannot be blank.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Timezone input */}
          <Form.Item label="Timezone" name="timezone">
            <Input />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>

        {/* Table */}
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={null}
          className="pt-[25px]"
        />
      </div>
    </div>
  );
};

export default Profile;
