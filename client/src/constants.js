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

export const formatTime = "MMM Do YYYY, h:mm:ss A";

const match1 = {
  id: "1",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "11",
        name: "Argentina",
      },
      score: {
        score: 2,
      },
    },
    visitor: {
      team: {
        id: "12",
        name: "Australia",
      },
      score: {
        score: 1,
      },
    },
  },
};
const match2 = {
  id: "2",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "21",
        name: "Belgium",
      },
      score: {
        score: 1,
      },
    },
    visitor: {
      team: {
        id: "22",
        name: "Brazil",
      },
      score: {
        score: 3,
      },
    },
  },
};
const match12 = {
  id: "12",
  name: "1/8",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "121",
        name: "Brazil",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match1,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "122",
        name: "Argentina",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match2,
        sourcePool: {},
      },
    },
  },
};

const match3 = {
  id: "3",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "31",
        name: "Cameroon",
      },
      score: {
        score: 2,
      },
    },
    visitor: {
      team: {
        id: "32",
        name: "Canada",
      },
      score: {
        score: 0,
      },
    },
  },
};
const match4 = {
  id: "4",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "41",
        name: "Costa Rica",
      },
      score: {
        score: 1,
      },
    },
    visitor: {
      team: {
        id: "42",
        name: "Croatia",
      },
      score: {
        score: 0,
      },
    },
  },
};
const match34 = {
  id: "34",
  name: "1/8",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "341",
        name: "Costa Rica",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match3,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "342",
        name: "Cameroon",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match4,
        sourcePool: {},
      },
    },
  },
};

const match5 = {
  id: "5",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "51",
        name: "Denmark",
      },
      score: {
        score: 3,
      },
    },
    visitor: {
      team: {
        id: "52",
        name: "Ecuador",
      },
      score: {
        score: 0,
      },
    },
  },
};
const match6 = {
  id: "6",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "61",
        name: "England",
      },
      score: {
        score: 1,
      },
    },
    visitor: {
      team: {
        id: "62",
        name: "France",
      },
      score: {
        score: 2,
      },
    },
  },
};
const match56 = {
  id: "56",
  name: "1/8",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "561",
        name: "France",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match5,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "562",
        name: "Denmark",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match6,
        sourcePool: {},
      },
    },
  },
};

const match7 = {
  id: "7",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "71",
        name: "Germany",
      },
      score: {
        score: 2,
      },
    },
    visitor: {
      team: {
        id: "72",
        name: "Ghana",
      },
      score: {
        score: 1,
      },
    },
  },
};
const match8 = {
  id: "8",
  name: "1/16",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "81",
        name: "Iran",
      },
      score: {
        score: 2,
      },
    },
    visitor: {
      team: {
        id: "82",
        name: "Japan",
      },
      score: {
        score: 0,
      },
    },
  },
};
const match78 = {
  id: "78",
  name: "1/8",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "781",
        name: "Iran",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match7,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "782",
        name: "Germany",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match8,
        sourcePool: {},
      },
    },
  },
};

const match1234 = {
  id: "1234",
  name: "Semi Final",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "12341",
        name: "Cameroon",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match12,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "12342",
        name: "Argentina",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match34,
        sourcePool: {},
      },
    },
  },
};

const match5678 = {
  id: "5678",
  name: "Semi Final",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "56781",
        name: "Germany",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match56,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "56782",
        name: "Denmark",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match78,
        sourcePool: {},
      },
    },
  },
};

export const match12345678 = {
  id: "12345678",
  name: "Final",
  scheduled: Number(new Date()),
  sides: {
    home: {
      team: {
        id: "123456781",
        name: "Denmark",
      },
      score: {
        score: 2,
      },
      seed: {
        displayName: "A1",
        rank: 1,
        sourceGame: match1234,
        sourcePool: {},
      },
    },
    visitor: {
      team: {
        id: "123456782",
        name: "Argentina",
      },
      score: {
        score: 3,
      },
      seed: {
        displayName: "A2",
        rank: 1,
        sourceGame: match5678,
        sourcePool: {},
      },
    },
  },
};
