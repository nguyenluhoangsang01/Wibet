import { Button, Checkbox, Form, Input, Table, Tooltip } from "antd";
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
  getAllAccessLevelReducerAsync,
  selectAccessLevel,
} from "../../state/accessLevelSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";
import Modals from "../Modals";

const TabAccessLevel = () => {
  // Initial form ref
  const form = useRef(null);
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteAccessLevel, setDeleteAccessLevel] = useState({ _id: null });
  const [gsCheckbox, setGsCheckbox] = useState(false);
  const [lgsCheckbox, setLgsCheckbox] = useState(false);
  const [isFinishRefresh, setIsFinishRefresh] = useState(false);
  // Get access token from global state
  const { accessToken } = useSelector(selectUser);
  // Get access level from global state
  const { accessLevel } = useSelector(selectAccessLevel);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

  // Handle update access by id
  const handleUpdate = (values) => {
    navigate(`/accessLevel/${values._id}/update`);
  };

  // Handle delete access level by id
  const handleDelete = (_id) => {
    // Open modal when user click trash icon
    setOpen(true);

    // Set _id
    setDeleteAccessLevel({ _id });
  };

  // Columns for access level
  const columnsAccessLevel = [
    {
      title: "Mục",
      dataIndex: "category",
      key: "category",
      render: (text) => <span className="font-bold capitalize">{text}</span>,
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Vòng bảng",
      dataIndex: "isGroupStage",
      key: "isGroupStage",
      render: (text) => (
        <span
          className={`rounded-full font-bold text-white capitalize font-[calibri] text-[16px] inline-flex items-center justify-center px-[15px] py-[3px] h-[22px] ${
            text ? "bg-[#28a745]" : "bg-[#dc3545]"
          }`}
        >
          {text ? "Có" : "Không"}
        </span>
      ),
    },
    {
      title: "Vòng loại trực tiếp",
      dataIndex: "isLiveGroupStage",
      key: "isLiveGroupStage",
      render: (text) => (
        <span
          className={`rounded-full font-bold text-white capitalize font-[calibri] text-[16px] inline-flex items-center justify-center px-[15px] py-[3px] h-[22px] ${
            text ? "bg-[#28a745]" : "bg-[#dc3545]"
          }`}
        >
          {text ? "Có" : "Không"}
        </span>
      ),
    },
    {
      title: "-",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <Tooltip title="Update info">
            <button
              onClick={() => handleUpdate(record)}
              className="bg-[#f0ad4e] border-[#eea236]"
            >
              <BsPencilFill />
            </button>
          </Tooltip>

          <Tooltip title="Delete this access level">
            <button
              onClick={() => handleDelete(record._id)}
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
  const onFinishAccessLevel = async (values) => {
    // Initial loading with true when user click create button
    setIsFinish(true);

    try {
      // Create new accessLevel
      const res = await axios.post(
        `/accessLevel`,
        { ...values, isGroupStage: gsCheckbox, isLiveGroupStage: lgsCheckbox },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (res.data) {
        // Then set is finish to false
        setIsFinish(false);

        // Get all reward again
        dispatch(getAllAccessLevelReducerAsync());

        // Reset form
        form.current.resetFields();
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "category") {
        form.current.setFields([
          {
            name: "category",
            errors: [data.message],
          },
          {
            name: "detail",
            errors: null,
          },
        ]);
      } else if (data.name === "detail") {
        // Check if name error is fullName and set error message after set fields to null
        form.current.setFields([
          {
            name: "category",
            errors: null,
          },
          {
            name: "detail",
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

  // Handle change group stage
  const onChangeGS = (e) => {
    setGsCheckbox(e.target.checked);
  };

  // Handle change live group stage
  const onChangeLGS = (e) => {
    setLgsCheckbox(e.target.checked);
  };

  // Handle confirm ok when user delete
  const handleOk = async () => {
    // Set loading to true first
    setIsFinishRefresh(true);

    try {
      const { data } = await axios.delete(
        `/accessLevel/${deleteAccessLevel._id}`,
        {
          headers: headers(accessToken),
        }
      );

      if (data) {
        // Dispatch get all rewards action
        dispatch(getAllAccessLevelReducerAsync());

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

  // Handle close access level modal
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Form
        name="settingsAccessLevel"
        onFinish={onFinishAccessLevel}
        autoComplete="off"
        ref={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        {/* Category input */}
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Category can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Detail input */}
        <Form.Item
          label="Detail"
          name="detail"
          rules={[
            {
              required: true,
              message: "Detail can not be blank",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Group stage check box */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Checkbox onChange={onChangeGS}>Group stage</Checkbox>
        </Form.Item>

        {/* Live group stage check box */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Checkbox onChange={onChangeLGS}>Live group stage</Checkbox>
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
        columns={columnsAccessLevel}
        dataSource={[...accessLevel]}
        className="pt-[25px] -mt-4"
        scroll={{ x: "90vw" }}
        loading={!accessLevel}
        pagination={false}
      />

      {/* Delete access level modal */}
      <Modals
        title="Delete access level"
        open={open}
        confirmLoading={isFinishRefresh}
        content="Are you sure you want to delete this access level?"
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default TabAccessLevel;
