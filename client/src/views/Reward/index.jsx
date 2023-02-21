import { Button, Form, Input, InputNumber, Modal, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { rewardsRoutes } from "../../constants";
import { headers } from "../../helper";
import {
	getAllRewardsReducerAsync,
	selectReward
} from "../../state/rewardSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Reward = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial navigate
  const navigate = useNavigate();
  // Get user and access token from global state
  const { user, accessToken } = useSelector(selectUser);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial form ref
  const form = useRef(null);
  // Initial state
  const [open, setOpen] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [deleteReward, setDeleteReward] = useState({
    _id: null,
    rewardName: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  // Get rewards from global state
  const { rewards } = useSelector(selectReward);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Get reward information
  useEffect(() => {
    dispatch(getAllRewardsReducerAsync());
  }, [dispatch]);

  if (!isShow) return <span>Loading...</span>;

  // Handle update reward with id
  const handleUpdateReward = (values) => {
    navigate(`/rewards/${values._id}/update`);
  };

  // Handle delete reward with id
  const handleDeleteReward = (_id, rewardName) => {
    // Open modal when user click trash icon
    setOpen(true);
    // Set _id and rewardName
    setDeleteReward({
      _id,
      rewardName,
    });
  };

  // Handle cancel when user no delete
  const handleCancel = () => {
    setOpen(false);
  };

  // Columns for reward
  const columnsReward = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => (
        <span className="font-bold">{index + 1}</span>
      ),
    },
    {
      title: "Giải",
      dataIndex: "rewardName",
      key: "rewardName",
    },
    {
      title: "Số lượng",
      dataIndex: "numberOfReward",
      key: "numberOfReward",
      render: (text) => <span>{text < 10 ? `0${text}` : text}</span>,
    },
    {
      title: "Tỷ lệ",
      dataIndex: "rewardRate",
      key: "rewardRate",
    },
    {
      title: "-",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <Tooltip title="Update info">
            <button
              onClick={() => handleUpdateReward(record)}
              className="bg-[#f0ad4e] border-[#eea236]"
            >
              <BsPencilFill />
            </button>
          </Tooltip>

          <Tooltip title="Delete this reward">
            <button
              onClick={() => handleDeleteReward(record._id, record.rewardName)}
              className="bg-[#d9534f] border-[#d43f3a]"
            >
              <CgClose />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Handle on finish
  const onFinish = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Create new reward
      const res = await axios.post(
        `/reward`,
        { ...values },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (res.data) {
        // Then set is finish to false
        setIsFinish(false);

        // And navigate to teams page
        navigate("/rules");
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "rewardName") {
        form.current.setFields([
          {
            name: "rewardName",
            errors: [data.message],
          },
          {
            name: "numberOfReward",
            errors: null,
          },
          {
            name: "rewardRate",
            errors: null,
          },
        ]);
      } else if (data.name === "numberOfReward") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "rewardName",
            errors: null,
          },
          {
            name: "numberOfReward",
            errors: [data.message],
          },
          {
            name: "rewardRate",
            errors: null,
          },
        ]);
      } else if (data.name === "rewardRate") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "rewardName",
            errors: null,
          },
          {
            name: "numberOfReward",
            errors: null,
          },
          {
            name: "rewardRate",
            errors: [data.message],
          },
        ]);
      }

      if (data.statusCode === 498) {
        dispatch(logoutReducerAsync(accessToken));
      }

      // Then set is finish to false
      setIsFinish(false);
    }
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setConfirmLoading(true);

    try {
      const { data } = await axios.delete(`/reward/${deleteReward._id}`, {
        headers: headers(accessToken),
      });

      if (data.success) {
        dispatch(getAllRewardsReducerAsync());

        // After delete successfully hide modal
        setOpen(false);

        // And set loading to false
        setConfirmLoading(false);

        // Send success notification
        toast.success(data.message);
      }
    } catch (error) {
      // Set loading to false if have error
      setConfirmLoading(false);

      // After delete successfully hide modal
      setOpen(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={rewardsRoutes} />

      {/* Heading */}
      <Heading title={pathname.slice(1)} />

      {/* Rewards form */}
      <Form
        name="rewards"
        onFinish={onFinish}
        autoComplete="off"
        ref={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 6 }}
      >
        {/* Reward name input */}
        <Form.Item
          label="Reward name"
          name="rewardName"
          rules={[
            {
              required: true,
              message: "Reward name can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Number of reward input */}
        <Form.Item
          label="Number of reward"
          name="numberOfReward"
          rules={[
            {
              required: true,
              message: "Number of reward can not be blank",
            },
            {
              type: "number",
              message: "Number of reward must be an integer",
            },
            {
              type: "number",
              min: 1,
              message: "Number of reward must be greater than or equal to 1",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Reward rate input */}
        <Form.Item
          label="Reward rate"
          name="rewardRate"
          rules={[
            {
              required: true,
              message: "Reward rate can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Create button */}
        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            className="bg-black flex items-center gap-2"
            disabled={isFinish}
          >
            {isFinish && <AiOutlineLoading3Quarters className="animate-spin" />}
            <span>Create</span>
          </Button>
        </Form.Item>
      </Form>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columnsReward}
        dataSource={[...rewards]}
        className="pt-[25px] -mt-4"
        scroll={{ x: "90vw" }}
        loading={rewards ? false : true}
        pagination={false}
      />

      <Modal
        title="Delete reward"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        keyboard={true}
        footer={[
          <Button key="cancel" onClick={handleCancel} disabled={confirmLoading}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
            className="bg-black"
            disabled={confirmLoading}
          >
            Ok
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="capitalize font-semibold">
            {deleteReward.rewardName}
          </span>
          ?
        </p>
      </Modal>
    </div>
  );
};

export default Reward;
