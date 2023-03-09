import { registerLicense } from "@syncfusion/ej2-base";
import axios from "axios";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import ErrorFallback from "./components/ErrorFallback";
import ScrollToTop from "./components/ScrollToTop";
import { routes } from "./constants";
import { getAllBetsReducerAsync } from "./state/betSlice";
import { getAllCommentsReducerAsync } from "./state/commentSlice";
import { getAllMatchesReducerAsync } from "./state/matchSlice";
import { getAllRewardsReducerAsync } from "./state/rewardSlice";
import { getTheLastSettingReducerAsync } from "./state/settingSlice";
import { getAllTeamsReducerAsync } from "./state/teamSlice";
import { getAllUsersReducerAsync, selectUser } from "./state/userSlice";

import Loading from "./views/Loading";

const BetCreate = lazy(() => import("./views/Bets/BetCreate"));
const BetUpdate = lazy(() => import("./views/Bets/BetUpdate"));
const BetViewAll = lazy(() => import("./views/Bets/BetViewAll"));
const Default = lazy(() => import("./layouts/Default"));
const Home = lazy(() => import("./views/Home"));
const MatchCreate = lazy(() => import("./views/Matches/MatchCreate"));
const MatchUpdateInfo = lazy(() => import("./views/Matches/MatchUpdateInfo"));
const MatchUpdateScore = lazy(() => import("./views/Matches/MatchUpdateScore"));
const MatchViewDetails = lazy(() => import("./views/Matches/MatchViewDetails"));
const TeamCreate = lazy(() => import("./views/Team/TeamCreate"));
const TeamUpdate = lazy(() => import("./views/Team/TeamUpdate"));
const UserCreate = lazy(() => import("./views/Users/UserCreate"));
const UserUpdate = lazy(() => import("./views/Users/UserUpdate"));
const UserUpdateMoney = lazy(() => import("./views/Users/UserUpdateMoney"));
const UserViewDetails = lazy(() => import("./views/Users/UserViewDetails"));
const RewardUpdate = lazy(() => import("./views/Reward/RewardUpdate"));
const AccessLevelUpdate = lazy(() =>
  import("./views/AccessLevel/AccessLevelUpdate")
);
const RankingViewDetails = lazy(() =>
  import("./views/Ranking/RankingViewDetails")
);

function App() {
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user logged from global state
  const { accessToken } = useSelector(selectUser);

  // Set axios defaults
  axios.defaults.baseURL = "http://11.11.7.222:8000/api";
  axios.defaults.headers.common = `Bearer ${accessToken}`;

  // Registering Syncfusion license key
  registerLicense(
    "Mgo+DSMBaFt/QHRqVVhlX1pAaVddX2NLfUN3T2BZdV14ZCQ7a15RRnVfQV1qSX9XcUdhWHpfdA==;Mgo+DSMBPh8sVXJ0S0J+XE9BdVRGQmtWfFN0RnNYdV1wflZOcC0sT3RfQF5jSn5adkRnXn1ccXJTQg==;ORg4AjUWIQA/Gnt2VVhkQlFac1xJWXxBYVF2R2BJflRzdF9FaEwgOX1dQl9gSX1Tf0ViXXhccnVdRGQ=;MTI4NTc0MUAzMjMwMmUzNDJlMzBBQjA0dWpKbnM2M1B1WmlNSCtyY0E2c2dvZmFUOTVCVno1MldEUkVtVUtjPQ==;MTI4NTc0MkAzMjMwMmUzNDJlMzBCenlxK2dUUjRkSXN1OUpBL2lXNGlHRktoN1c5bVBORkNMaTloYW5kS01FPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFpBVmdWdkx0RWFab196d1VMY1RBNQtUQF1hSn5QdkxjWHtZcnZXQ2FY;MTI4NTc0NEAzMjMwMmUzNDJlMzBiVmpveldCNnZYbUxGSS9DOCs1TElqZXdSSWQ3a1RhckZVS2JxK3Y2VXEwPQ==;MTI4NTc0NUAzMjMwMmUzNDJlMzBmVXdyVVFKdGwzRnVnVk1PSlpHQUpPSjh1MlpkUGJzV0hPOXBYeFdtWTdvPQ==;Mgo+DSMBMAY9C3t2VVhkQlFac1xJWXxBYVF2R2BJflRzdF9FaEwgOX1dQl9gSX1Tf0ViXXhccndXT2Q=;MTI4NTc0N0AzMjMwMmUzNDJlMzBvMUcyeThWTXhXSk93T1U3RUUvYVo3RE0zdktHd3RUOFdUK3NLbnZYQVpvPQ==;MTI4NTc0OEAzMjMwMmUzNDJlMzBrb0tWY0ZqSi9CK0ZCOWtrZDVyZ0tZTHV0K0IybDVqUU9VWXRNMjNxcUVBPQ==;MTI4NTc0OUAzMjMwMmUzNDJlMzBiVmpveldCNnZYbUxGSS9DOCs1TElqZXdSSWQ3a1RhckZVS2JxK3Y2VXEwPQ=="
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        dispatch(getAllBetsReducerAsync(accessToken));
        dispatch(getAllCommentsReducerAsync());
        dispatch(getAllMatchesReducerAsync());
        dispatch(getAllRewardsReducerAsync());
        dispatch(getTheLastSettingReducerAsync());
        dispatch(getAllTeamsReducerAsync(accessToken));
        dispatch(getAllUsersReducerAsync());
      }}
    >
      <Toaster
        toastOptions={{
          className:
            "font-[calibri] text-[16px] mt-[40px] border-[1px] border-[#222] shadow-xl",
          duration: 5000,
        }}
      />

      <ScrollToTop />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<Default />}>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Nested routes of match */}
            <Route
              path="/matches/:id/view-details"
              element={<MatchViewDetails />}
            />
            <Route
              path="/matches/:id/update-score"
              element={<MatchUpdateScore />}
            />
            <Route
              path="/matches/:id/update-info"
              element={<MatchUpdateInfo />}
            />
            <Route path="/matches/create" element={<MatchCreate />} />

            {/* Nested routes of bet */}
            <Route path="/matches/bet/create/:id" element={<BetCreate />} />
            <Route
              path="/matches/bet/view-match/:id"
              element={<BetViewAll />}
            />
            <Route
              path="/matches/bet/update/:matchId/:betId"
              element={<BetUpdate />}
            />

            {/* Nested routes of user */}
            <Route path="/users/create" element={<UserCreate />} />
            <Route
              path="/users/:id/view-details"
              element={<UserViewDetails />}
            />
            <Route path="/users/:id/update" element={<UserUpdate />} />
            <Route
              path="/users/:id/update/money"
              element={<UserUpdateMoney />}
            />

            {/* Nested routes of team */}
            <Route path="/teams/create" element={<TeamCreate />} />
            <Route path="/teams/:id/update" element={<TeamUpdate />} />

            {/* Nested routes of ranking */}
            <Route path="/ranking/:id" element={<RankingViewDetails />} />

            {/* Nested route of reward */}
            <Route path="/rewards/:id/update" element={<RewardUpdate />} />

            {/* Nested route of access level */}
            <Route
              path="/accessLevel/:id/update"
              element={<AccessLevelUpdate />}
            />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
