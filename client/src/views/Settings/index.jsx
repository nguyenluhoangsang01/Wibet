import { Tabs } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Modals from "../../components/Modals";
import TabAccessLevel from "../../components/TabAccessLevel";
import TabBank from "../../components/TabBank";
import TabBet from "../../components/TabBet";
import TabMoMo from "../../components/TabMoMo";
import TabMoney from "../../components/TabMoney";
import TabPassword from "../../components/TabPassword";
import TabRate from "../../components/TabRate";
import TabReward from "../../components/TabReward";
import TabScore from "../../components/TabScore";
import TabSkype from "../../components/TabSkype";
import { settingsRoutes } from "../../constants";
import { capitalize, headers } from "../../helper";
import { getAllAccessLevelReducer } from "../../state/accessLevelSlice";
import { getAllRewardsReducer } from "../../state/rewardSlice";
import { updateSettingReducer } from "../../state/settingSlice";
import { selectUser } from "../../state/userSlice";

const Settings = () => {
  // Get pathname from location
  const { pathname } = useLocation();
  // Initial state
  const [open, setOpen] = useState(false);
  const [isFinishRefresh, setIsFinishRefresh] = useState(false);
  const [isShow1, setIsShow1] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  const [isShow3, setIsShow3] = useState(false);
  // Get user and access token from global state
  const { user, accessToken } = useSelector(selectUser);

  // Initial dispatch
  const dispatch = useDispatch();
  // Initial navigate
  const navigate = useNavigate();

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
    (async () => {
      try {
        const res = await axios.get("/setting", {
          headers: headers(accessToken),
        });

        if (res.data) {
          dispatch(updateSettingReducer(res.data));

          setIsShow1(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(updateSettingReducer(response.data));
        }
      }
    })();
  }, [accessToken, dispatch]);

  // Get reward information
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/reward");

        if (data) {
          dispatch(getAllRewardsReducer(data));

          setIsShow2(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllRewardsReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  // Get access level information
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/accessLevel");

        if (data) {
          dispatch(getAllAccessLevelReducer(data));

          setIsShow3(true);
        }
      } catch ({ response }) {
        if (response.data) {
          dispatch(getAllAccessLevelReducer(response.data));
        }
      }
    })();
  }, [dispatch]);

  if (!isShow1 && !isShow2 && !isShow3) return <span>Loading...</span>;

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

  // Handle close modal
  const handleCancel = () => {
    setOpen(false);
  };

  const items = [
    {
      key: "accessLevel",
      label: `Access level`,
      children: <TabAccessLevel />,
    },
    {
      key: "bank",
      label: `Bank`,
      children: <TabBank />,
    },
    {
      key: "betMoney",
      label: `Bet`,
      children: <TabBet />,
    },
    {
      key: "moMo",
      label: `MoMo`,
      children: <TabMoMo />,
    },
    {
      key: "money",
      label: `Money`,
      children: <TabMoney />,
    },
    {
      key: "password",
      label: "Password",
      children: <TabPassword />,
    },
    {
      key: "rate",
      label: "Rate",
      children: <TabRate />,
    },
    {
      key: "rewards",
      label: `Rewards`,
      children: <TabReward />,
    },
    {
      key: "score",
      label: `Score`,
      children: <TabScore />,
    },
    {
      key: "skype",
      label: `Skype`,
      children: <TabSkype />,
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

      <Tabs defaultActiveKey="accessLevel" items={items} />

      {/* Refresh current setting modal */}
      <Modals
        title="Refresh current settings"
        open={open}
        confirmLoading={isFinishRefresh}
        content="Are you sure you want to refresh current settings?"
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default Settings;
