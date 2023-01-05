import { lazy } from "react";

const Account = lazy(() => import("./views/Account"));
const Analysis = lazy(() => import("./views/Analysis"));
const Brackets = lazy(() => import("./views/Brackets"));
const Comments = lazy(() => import("./views/Comments"));
const Home = lazy(() => import("./views/Home"));
const Login = lazy(() => import("./views/Login"));
const Matches = lazy(() => import("./views/Matches"));
const NotFound = lazy(() => import("./views/NotFound"));
const Profile = lazy(() => import("./views/Profile"));
const Ranking = lazy(() => import("./views/Ranking"));
const Rules = lazy(() => import("./views/Rules"));
const Team = lazy(() => import("./views/Team"));
const Users = lazy(() => import("./views/Users"));

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/rules",
    element: <Rules />,
  },
  {
    path: "/brackets",
    element: <Brackets />,
  },
  {
    path: "/analysis",
    element: <Analysis />,
  },
  {
    path: "/comments",
    element: <Comments />,
  },
  {
    path: "/ranking",
    element: <Ranking />,
  },
  {
    path: "/matches",
    element: <Matches />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/teams",
    element: <Team />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
];

export const navbarRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "/rules",
    name: "rules",
  },
  {
    path: "/brackets",
    name: "brackets",
  },
  {
    path: "/analysis",
    name: "analysis",
  },
  {
    path: "/comments",
    name: "comments",
  },
  {
    path: "/ranking",
    name: "ranking",
  },
  {
    path: "/matches",
    name: "matches",
  },
  {
    path: "/users",
    name: "users",
  },
  {
    path: "/teams",
    name: "teams",
  },
];

export const accountRoutes = [
  {
    path: "/account",
    name: "account",
  },
  {
    path: "/profile",
    name: "profile",
  },
  {
    path: "",
    name: "logout",
  },
];

export const ruleRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "rules",
  },
];

export const bracketRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "brackets",
  },
];

export const rankingRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "ranking",
  },
];

export const matchesRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "matches",
  },
];

export const usersRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "users",
  },
];

export const teamRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "teams",
  },
];

export const accountRoutesB = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "account",
  },
];

export const profileRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "profile",
  },
];

export const loginRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "login",
  },
];

export const createUserRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "/users",
    name: "users",
  },
  {
    path: "",
    name: "create user",
  },
];

export const createTeamRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "/teams",
    name: "teams",
  },
  {
    path: "",
    name: "Create Team",
  },
];

export const ROLES = [
  {
    value: "Admin",
    label: "Admin",
  },
  {
    value: "User",
    label: "User",
  },
  {
    value: "Guest",
    label: "Guest",
  },
];

export const STATUS = [
  {
    value: "Inactive",
    label: "Inactive",
  },
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Unconfirmed email",
    label: "Unconfirmed email",
  },
];

export const ROLESDEFAULT = {
  Admin: "Admin",
  User: "User",
  Guest: "Guest",
};

export const STATUSDEFAULT = {
  Inactive: "Inactive",
  Active: "Active",
  "Unconfirmed email": "Unconfirmed email",
};

export const DEFAULT_IMAGE =
  "https://res.cloudinary.com/wibet/image/upload/v1672115166/img_aff_mecup2022_logo_cyykbh.png";

export const createMatchRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "/matches",
    name: "matches",
  },
  {
    path: "",
    name: "Create Match",
  },
];

// Access level
export const accessLevel = [
  {
    _id: "accessLevel1",
    category: "Ranking",
    details: "Xem lịch sử đặt cược của người chơi khác",
    groupState: true,
    knockoutRound: false,
  },
  {
    _id: "accessLevel2",
    category: "Ranking",
    details: "Xem thông tin cơ bản về số điểm hiện có và số điểm đã cược",
    groupState: true,
    knockoutRound: true,
  },
  {
    _id: "accessLevel3",
    category: "Matches",
    details: "Xem tỉ lệ đặt cược và tỉ lệ chọi",
    groupState: true,
    knockoutRound: true,
  },
  {
    _id: "accessLevel4",
    category: "Matches",
    details: "Xem thông tin chi tiết về danh sách người chơi tham gia cược",
    groupState: true,
    knockoutRound: false,
  },
  {
    _id: "accessLevel5",
    category: "Matches",
    details: "Xem số điểm bản thân đã cược và chỉnh sửa",
    groupState: true,
    knockoutRound: true,
  },
  {
    _id: "accessLevel6",
    category: "Matches",
    details: "Xem chi tiết cược của trận đang đấu",
    groupState: true,
    knockoutRound: false,
  },
];

// Reward data
export const dataReward = [
  {
    _id: "reward1",
    award: "DIAMOND",
    quantity: "01",
    rates: "~30%",
  },
  {
    _id: "reward2",
    award: "PLATINUM",
    quantity: "01",
    rates: "~20%",
  },
  {
    _id: "reward3",
    award: "GOLD",
    quantity: "02",
    rates: "~10%",
  },
  {
    _id: "reward4",
    award: "SILVER",
    quantity: "04",
    rates: "~05%",
  },
];
