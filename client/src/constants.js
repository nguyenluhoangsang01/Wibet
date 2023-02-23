import { lazy } from "react";

const Account = lazy(() => import("./views/Account"));
const Analysis = lazy(() => import("./views/Analysis"));
const Brackets = lazy(() => import("./views/Brackets"));
const Comments = lazy(() => import("./views/Comments"));
const Login = lazy(() => import("./views/Login"));
const Matches = lazy(() => import("./views/Matches"));
const NotFound = lazy(() => import("./views/NotFound"));
const Profile = lazy(() => import("./views/Profile"));
const Ranking = lazy(() => import("./views/Ranking"));
const Rules = lazy(() => import("./views/Rules"));
const Team = lazy(() => import("./views/Team"));
const Users = lazy(() => import("./views/Users"));
const Settings = lazy(() => import("./views/Settings"));

export const REACT_TRANSFORM_SECRET_KEY =
  "5050258b73c97ab79c806255cd08c817005e696e79d22e8f833ff9f7b32902b8b5f0c30567eb059c3fb3776be1f21c979f18a78f620dfa574b28cdafcec5efb700d9912a9342dff5d21245ac4b70a6e9248254cdc68cf5e858f895664ca76f81e90ef5b815614f377104f0fba73accb283ae689eb56047711ff65a7287f970d7";

export const routes = [
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
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
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
    path: "/settings",
    name: "settings",
    roleID: "Admin",
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

export const settingsRoutes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "",
    name: "settings",
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
};

export const STATUSDEFAULT = {
  Inactive: "Inactive",
  Active: "Active",
  "Unconfirmed email": "Unconfirmed email",
};

export const DEFAULT_IMAGE =
  "https://res.cloudinary.com/wibet/image/upload/v1673334255/logo-w_ahvbug.png";

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

export const formatTime = "MMM Do YYYY, h:mm:ss A";

export const plainPasswordOptions = [
  "Min",
  "Max",
  "Uppercase",
  "Lowercase",
  "Digit",
  "Symbols",
];
