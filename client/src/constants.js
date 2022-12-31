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

export const headers = {
  authorization: `Bearer ${JSON.parse(
    localStorage.getItem("persist:user")
  )?.accessToken?.replaceAll('"', "")}`,
};

export const headersFormData = {
  authorization: `Bearer ${JSON.parse(
    localStorage.getItem("persist:user")
  )?.accessToken?.replaceAll('"', "")}`,
  "Content-Type": "multipart/form-data",
};

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
