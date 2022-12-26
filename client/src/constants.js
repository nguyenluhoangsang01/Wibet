import {
  Account,
  Analysis,
  Brackets,
  Comments,
  Home,
  Login,
  Matches,
  NotFound,
  Profile,
  Ranking,
  Rules,
  Team,
  Users,
} from "./views";

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
