import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import ModalDeleteAccessLevel from "../../components/ModalDeleteAccessLevel";
import ModalDeleteReward from "../../components/ModalDeleteReward";
import ModalRefreshCurrentSettings from "../../components/ModalRefreshCurrentSettings";
import { plainPasswordOptions, settingsRoutes } from "../../constants";
import { capitalize, headers } from "../../helper";
import {
  getAllAccessLevelReducerAsync,
  selectAccessLevel,
} from "../../state/accessLevelSlice";
import {
  getAllRewardsReducerAsync,
  selectReward,
} from "../../state/rewardSlice";
import {
  getTheLastSettingReducerAsync,
  selectSetting,
  updateSettingReducer,
} from "../../state/settingSlice";
import { logoutReducerAsync, selectUser } from "../../state/userSlice";

const Settings = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial state
  const [isFinish, setIsFinish] = useState(false);
  const [isFinishR, setIsFinishR] = useState(false);
  const [isFinishA, setIsFinishA] = useState(false);
  const [open, setOpen] = useState(false);
  const [openR, setOpenR] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [deleteReward, setDeleteReward] = useState({
    _id: null,
    rewardName: null,
  });
  const [deleteAccessLevel, setDeleteAccessLevel] = useState({ _id: null });
  const [isFinishRefresh, setIsFinishRefresh] = useState(false);
  const [confirmLoadingR, setConfirmLoadingR] = useState(false);
  const [confirmLoadingA, setConfirmLoadingA] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [gsCheckbox, setGsCheckbox] = useState(false);
  const [lgsCheckbox, setLgsCheckbox] = useState(false);
  // Get rewards from global state
  const { rewards } = useSelector(selectReward);
  // Get settings from global state
  const { settings } = useSelector(selectSetting);
  // Get user and access token from global state
  const { user, accessToken } = useSelector(selectUser);
  // Get access level from global state
  const { accessLevel } = useSelector(selectAccessLevel);
  // Initial form ref
  const form = useRef(null);
  const formR = useRef(null);
  const formA = useRef(null);
  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  // Check if user not exists
  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  // Check if user role ID is difference Admin back to home page
  useEffect(() => {
    if (user?.roleID !== "Admin") navigate("/");
  }, [navigate, user?.roleID]);

  // Get the last settings
  useEffect(() => {
    dispatch(getTheLastSettingReducerAsync(accessToken));
  }, [accessToken, dispatch]);

  // Get reward information
  useEffect(() => {
    dispatch(getAllRewardsReducerAsync());
  }, [dispatch]);

  // Get access level information
  useEffect(() => {
    dispatch(getAllAccessLevelReducerAsync());
  }, [dispatch]);

  // Default options selected
  useEffect(() => {
    setCheckedList([
      settings?.isMin && "Min",
      settings?.isMax && "Max",
      settings?.isUppercaseLetter && "Uppercase",
      settings?.isLowercaseLetter && "Lowercase",
      settings?.isNumber && "Digit",
      settings?.isSymbols && "Symbols",
    ]);
  }, [
    settings?.isMin,
    settings?.isMax,
    settings?.isUppercaseLetter,
    settings?.isLowercaseLetter,
    settings?.isNumber,
    settings?.isSymbols,
  ]);

  if (!isShow) return <span>Loading...</span>;

  // Handle refresh setting action
  const handleRefresh = async () => {
    setOpen(true);
  };

  // Handle ok when refresh settings
  const handleOk = async () => {
    // Initial loading with true when user click refresh button
    setIsFinishRefresh(true);

    try {
      // Refresh settings api
      const { data } = await axios.post("/setting", null, {
        headers: headers(accessToken),
      });

      // Check if data is exists
      if (data) {
        // Dispatch update settings action
        dispatch(updateSettingReducer(data));

        // Close model when refresh successfully
        setOpen(false);

        // Set loading to false when refresh successfully
        setIsFinishRefresh(false);

        // And navigate to home page
        navigate("/");
      }
    } catch (error) {
      // If occur error close model and set loading to false when have error
      setOpen(false);

      setIsFinishRefresh(false);
    }
  };

  // Handle confirm ok when user delete
  const handleOkR = async () => {
    // Set loading to true first
    setConfirmLoadingR(true);

    try {
      const { data } = await axios.delete(`/reward/${deleteReward._id}`, {
        headers: headers(accessToken),
      });

      if (data) {
        // Dispatch get all rewards action
        dispatch(getAllRewardsReducerAsync());

        // After delete successfully hide modal
        setOpenR(false);

        // And set loading to false
        setConfirmLoadingR(false);

        // Send success notification
        toast.success(data.message);
      }
    } catch (error) {
      // Set loading to false if have error
      setConfirmLoadingR(false);

      // After delete successfully hide modal
      setOpenR(false);
    }
  };

  // Handle confirm ok when user delete
  const handleOkA = async () => {
    // Set loading to true first
    setConfirmLoadingA(true);

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
        setOpenA(false);

        // And set loading to false
        setConfirmLoadingA(false);

        // Send success notification
        toast.success(data.message);
      }
    } catch (error) {
      // Set loading to false if have error
      setConfirmLoadingA(false);

      // After delete successfully hide modal
      setOpenA(false);
    }
  };

  // Handle close modal
  const handleCancel = () => {
    setOpen(false);
  };

  // Handle close reward modal
  const handleCancelR = () => {
    setOpenR(false);
  };

  // Handle close access level modal
  const handleCancelA = () => {
    setOpenA(false);
  };

  // Handle update reward by id
  const handleUpdateReward = (values) => {
    navigate(`/rewards/${values._id}/update`);
  };

  // Handle update access by id
  const handleUpdateAccessLevel = (values) => {
    navigate(`/accessLevel/${values._id}/update`);
  };

  // Handle delete reward by id
  const handleDeleteReward = (_id, rewardName) => {
    // Open modal when user click trash icon
    setOpenR(true);

    // Set _id and rewardName
    setDeleteReward({
      _id,
      rewardName,
    });
  };

  // Handle delete access level by id
  const handleDeleteAccessLevel = (_id) => {
    // Open modal when user click trash icon
    setOpenA(true);

    // Set _id
    setDeleteAccessLevel({ _id });
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
              onClick={() => handleUpdateAccessLevel(record)}
              className="bg-[#f0ad4e] border-[#eea236]"
            >
              <BsPencilFill />
            </button>
          </Tooltip>

          <Tooltip title="Delete this access level">
            <button
              onClick={() => handleDeleteAccessLevel(record._id)}
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
    // Initial loading with true when user click update button
    setIsFinish(true);

    try {
      // Update settings api with values get from form and headers
      const { data } = await axios.patch(
        "/setting",
        {
          ...settings,
          ...values,
          isMin: checkedList.includes("Min"),
          isMax: checkedList.includes("Max"),
          isUppercaseLetter: checkedList.includes("Uppercase"),
          isLowercaseLetter: checkedList.includes("Lowercase"),
          isNumber: checkedList.includes("Digit"),
          isSymbols: checkedList.includes("Symbols"),
        },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (data) {
        // Dispatch update settings reducer
        dispatch(updateSettingReducer(data));

        // Set loading of button to false when update successfully
        setIsFinish(false);

        // And navigate to home page
        navigate("/");
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "minPassword") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: [data.message],
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "maxPassword") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: [data.message],
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "minRate") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: [data.message],
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "maxRate") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: [data.message],
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "minBetMoney") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: [data.message],
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "maxScore") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: [data.message],
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "defaultMoney") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: [data.message],
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "wrongPasswordTimes") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: [data.message],
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "timeUpdateScore") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: [data.message],
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "timeBet") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: [data.message],
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "nameOfBank") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: [data.message],
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "stkOfBank") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: [data.message],
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "bank") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: [data.message],
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "contentOfBank") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: [data.message],
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "noteOfBank") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: [data.message],
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "numberOfMoMo") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: [data.message],
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "nameOfMoMo") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: [data.message],
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "contentOfMoMo") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: [data.message],
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "noteOfMoMo") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: [data.message],
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "skypeName") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: [data.message],
          },
          {
            name: "skypeLink",
            errors: null,
          },
        ]);
      } else if (data.name === "skypeLink") {
        form.current.setFields([
          {
            name: "minPassword",
            errors: null,
          },
          {
            name: "maxPassword",
            errors: null,
          },
          {
            name: "minRate",
            errors: null,
          },
          {
            name: "maxRate",
            errors: null,
          },
          {
            name: "minBetMoney",
            errors: null,
          },
          {
            name: "maxScore",
            errors: null,
          },
          {
            name: "defaultMoney",
            errors: null,
          },
          {
            name: "wrongPasswordTimes",
            errors: null,
          },
          {
            name: "timeUpdateScore",
            errors: null,
          },
          {
            name: "timeBet",
            errors: null,
          },
          {
            name: "nameOfBank",
            errors: null,
          },
          {
            name: "stkOfBank",
            errors: null,
          },
          {
            name: "bank",
            errors: null,
          },
          {
            name: "contentOfBank",
            errors: null,
          },
          {
            name: "noteOfBank",
            errors: null,
          },
          {
            name: "numberOfMoMo",
            errors: null,
          },
          {
            name: "nameOfMoMo",
            errors: null,
          },
          {
            name: "contentOfMoMo",
            errors: null,
          },
          {
            name: "noteOfMoMo",
            errors: null,
          },
          {
            name: "skypeName",
            errors: null,
          },
          {
            name: "skypeLink",
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

  // Handle on finish
  const onFinishR = async (values) => {
    // Initial loading with true when user click create button
    setIsFinishR(true);

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
        setIsFinishR(false);

        // Get all reward again
        dispatch(getAllRewardsReducerAsync());

        // Reset form
        formR.current.resetFields();
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "rewardName") {
        formR.current.setFields([
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
        formR.current.setFields([
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
        formR.current.setFields([
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
      setIsFinishR(false);
    }
  };

  // Handle on finish
  const onFinishA = async (values) => {
    // Initial loading with true when user click create button
    setIsFinishA(true);

    try {
      console.log({
        ...values,
        isGroupStage: gsCheckbox,
        isLiveGroupStage: lgsCheckbox,
      });
      // Create new accessLevel
      const res = await axios.post(
        `/accessLevel`,
        { ...values, isGroupStage: gsCheckbox, isLiveGroupStage: lgsCheckbox },
        { headers: headers(accessToken) }
      );

      // Check if data is exists
      if (res.data) {
        // Then set is finish to false
        setIsFinishA(false);

        // Get all reward again
        dispatch(getAllAccessLevelReducerAsync());

        // Reset form
        formA.current.resetFields();
      }
    } catch ({ response: { data } }) {
      // Check if name error is name and set error message after set fields to null
      if (data.name === "category") {
        formA.current.setFields([
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
        formA.current.setFields([
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
      setIsFinishA(false);
    }
  };

  // Handle select password options
  const onChange = () => {
    setCheckedList([
      settings?.isMin && "Min",
      settings?.isMax && "Max",
      settings?.isUppercaseLetter && "Uppercase",
      settings?.isLowercaseLetter && "Lowercase",
      settings?.isNumber && "Digit",
      settings?.isSymbols && "Symbols",
    ]);
  };

  // Handle change group stage
  const onChangeGS = (e) => {
    setGsCheckbox(e.target.checked);
  };

  // Handle change live group stage
  const onChangeLGS = (e) => {
    setLgsCheckbox(e.target.checked);
  };

  const items = [
    {
      key: "password",
      label: `Password`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          {/* Min password input */}
          <Form.Item
            label="Min password"
            name="minPassword"
            rules={[
              {
                required: true,
                message: "Min password can not be blank",
              },
              {
                type: "number",
                message: "Min password is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Max password input */}
          <Form.Item
            label="Max password"
            name="maxPassword"
            rules={[
              {
                required: true,
                message: "Max password can not be blank",
              },
              {
                type: "number",
                message: "Max password is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Wrong password times */}
          <Form.Item
            label="Wrong password times"
            name="wrongPasswordTimes"
            rules={[
              {
                required: true,
                message: "Wrong password times can not be blank",
              },
              {
                type: "number",
                message: "Wrong password times is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            <Checkbox.Group
              options={plainPasswordOptions}
              value={checkedList}
              onChange={onChange}
            />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "rate",
      label: `Rate`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          {/* Min rate input */}
          <Form.Item
            label="Min rate"
            name="minRate"
            rules={[
              {
                required: true,
                message: "Min rate can not be blank",
              },
              {
                type: "number",
                message: "Min rate is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Max rate input */}
          <Form.Item
            label="Max rate"
            name="maxRate"
            rules={[
              {
                required: true,
                message: "Max rate can not be blank",
              },
              {
                type: "number",
                message: "Max rate is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "betMoney",
      label: `Bet`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          {/* Min bet money input */}
          <Form.Item
            label="Min bet money"
            name="minBetMoney"
            rules={[
              {
                required: true,
                message: "Min bet money can not be blank",
              },
              {
                type: "number",
                message: "Min bet money is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Time to bet */}
          <Form.Item
            label="Time to bet (m)"
            name="timeBet"
            rules={[
              {
                required: true,
                message: "Time to bet can not be blank",
              },
              {
                type: "number",
                message: "Time to bet is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "score",
      label: `Score`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          {/* Max score input */}
          <Form.Item
            label="Max score"
            name="maxScore"
            rules={[
              {
                required: true,
                message: "Max score can not be blank",
              },
              {
                type: "number",
                message: "Max score is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Time to update score */}
          <Form.Item
            label="Time to update score (m)"
            name="timeUpdateScore"
            rules={[
              {
                required: true,
                message: "Time to update score can not be blank",
              },
              {
                type: "number",
                message: "Time to update score is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "money",
      label: `Money`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          {/* Default money */}
          <Form.Item
            label="Default money"
            name="defaultMoney"
            rules={[
              {
                required: true,
                message: "Default money can not be blank",
              },
              {
                type: "number",
                message: "Default money is not a valid number",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "bank",
      label: `Bank`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          {/* Name of bank */}
          <Form.Item
            label="Name of bank"
            name="nameOfBank"
            rules={[
              {
                required: true,
                message: "Name of bank can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Bank account number */}
          <Form.Item
            label="Bank account number"
            name="stkOfBank"
            rules={[
              {
                required: true,
                message: "Bank account number can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Bank */}
          <Form.Item
            label="Bank"
            name="bank"
            rules={[
              {
                required: true,
                message: "Bank can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* Transfer content of bank */}
          <Form.Item
            label="Transfer content of bank"
            name="contentOfBank"
            rules={[
              {
                required: true,
                message: "Transfer content of bank can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Note of bank */}
          <Form.Item
            label="Note of bank"
            name="noteOfBank"
            rules={[
              {
                required: true,
                message: "Note of bank can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "moMo",
      label: `MoMo`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="MoMo account number"
            name="numberOfMoMo"
            rules={[
              {
                required: true,
                message: "MoMo account number can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="MoMo account name"
            name="nameOfMoMo"
            rules={[
              {
                required: true,
                message: "MoMo account name can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Transfer content of MoMo"
            name="contentOfMoMo"
            rules={[
              {
                required: true,
                message: "Transfer content of MoMo can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Note of MoMo"
            name="noteOfMoMo"
            rules={[
              {
                required: true,
                message: "Note of MoMo can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "skype",
      label: `Skype`,
      children: (
        <Form
          name="settings"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ ...settings }}
          ref={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="Skype name"
            name="skypeName"
            rules={[
              {
                required: true,
                message: "Skype name can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Skype link"
            name="skypeLink"
            rules={[
              {
                required: true,
                message: "Skype link can not be blank",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Update button */}
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black flex items-center gap-2"
              disabled={isFinish}
            >
              {isFinish && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "rewards",
      label: `Rewards`,
      children: (
        <>
          <Form
            name="settings"
            onFinish={onFinishR}
            autoComplete="off"
            ref={formR}
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
                  message:
                    "Number of reward must be greater than or equal to 1",
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
                disabled={isFinishR}
              >
                {isFinishR && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
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
        </>
      ),
    },
    {
      key: "accessLevel",
      label: `Access level`,
      children: (
        <>
          <Form
            name="accessLevel"
            onFinish={onFinishA}
            autoComplete="off"
            ref={formA}
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
                disabled={isFinishA}
              >
                {isFinishA && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
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
            loading={accessLevel ? false : true}
            pagination={false}
          />
        </>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-50px-60px-40px)]">
      {/* Breadcrumbs */}
      <Breadcrumbs routes={settingsRoutes} />

      <div className="flex items-center justify-between action-details">
        {/* Heading */}
        <Heading title={pathname.slice(1)} />

        {/* Action */}
        <button
          className="!bg-[#FFC107] !text-black flex items-center gap-2"
          disabled={isFinishRefresh}
          onClick={handleRefresh}
        >
          Refresh all
        </button>
      </div>

      <Tabs defaultActiveKey="password" items={items} onChange={onChange} />

      {/* Refresh current setting modal */}
      <ModalRefreshCurrentSettings
        open={open}
        handleOk={handleOk}
        handleCancel={handleCancel}
        isFinishRefresh={isFinishRefresh}
      />

      {/* Delete reward modal */}
      <ModalDeleteReward
        openR={openR}
        handleOkR={handleOkR}
        handleCancelR={handleCancelR}
        confirmLoadingR={confirmLoadingR}
        deleteReward={deleteReward}
      />

      {/* Access level modal */}
      <ModalDeleteAccessLevel
        openA={openA}
        handleOkA={handleOkA}
        handleCancelA={handleCancelA}
        confirmLoadingA={confirmLoadingA}
      />
    </div>
  );
};

export default Settings;
