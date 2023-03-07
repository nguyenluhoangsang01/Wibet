import { Button, Form, Input, InputNumber, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { headers } from "../../helper";
import {
  getAllRewardsReducerAsync,
  selectReward,
} from "../../state/rewardSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";
import Modals from "../Modals";

const TabReward = () => {
  // Initial form ref
  const form = useRef(null);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFinishRefresh, setIsFinishRefresh] = useState(false);
  const [deleteReward, setDeleteReward] = useState({
    _id: null,
    rewardName: null,
  });
  // Get access token from global state
  const { accessToken } = useSelector(selectUser);
  // Get rewards from global state
  const { rewards } = useSelector(selectReward);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

  // Handle update reward by id
  const handleUpdateReward = (values) => {
    navigate(`/rewards/${values._id}/update`);
  };

  // Handle delete reward by id
  const handleDeleteReward = (_id, rewardName) => {
    // Open modal when user click trash icon
    setOpen(true);

    // Set _id and rewardName
    setDeleteReward({
      _id,
      rewardName,
    });
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setIsFinishRefresh(true);

    try {
      const { data } = await axios.delete(`/reward/${deleteReward._id}`, {
        headers: headers(accessToken),
      });

      if (data) {
        // Dispatch get all rewards action
        dispatch(getAllRewardsReducerAsync());

        // After delete successfully hide modal
        setOpen(false);

        // And set loading to false
        setIsFinishRefresh(false);

        // Send success notification
        toast.success(data.message);
      }
    } catch (error) {
      // Set loading to false if have error
      setIsFinishRefresh(false);

      // After delete successfully hide modal
      setOpen(false);
    }
  };

  // Handle close reward modal
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle update Rewards settings
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

        // Get all reward again
        dispatch(getAllRewardsReducerAsync());

        // Reset form
        form.current.resetFields();
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

  // Columns for reward
  const columnsReward = [
    {
      title: "#",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => <span>{index + 1}</span>,
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

  return (
    <>
      <Form
        name="settingsRewards"
        onFinish={onFinish}
        autoComplete="off"
        ref={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
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
        <Form.Item wrapperCol={{ offset: 6 }}>
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
        loading={!rewards}
        pagination={false}
      />

      {/* Delete reward modal */}
      <Modals
        title="Delete reward"
        open={open}
        confirmLoading={isFinishRefresh}
        content={`Are you sure you want to delete ${deleteReward.rewardName} reward?`}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default TabReward;
