import {
	Account,
	Analysis,
	Brackets,
	Comments,
	Home,
	Login,
	Matches,
	Profile,
	Ranking,
	Rules,
	Team,
	Users
} from "./views";

export const defaultLayout = [
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
    path: "/team",
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
    path: "/team",
    name: "team",
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
    name: "team",
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
