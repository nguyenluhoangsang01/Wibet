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
import { getAllTeamsReducerAsync } from "./state/teamSlice";
import { getAllUsersReducerAsync, selectUser } from "./state/userSlice";
import BetUpdate from "./views/Bets/BetUpdate";
import BetViewAll from "./views/Bets/BetViewAll";
import Loading from "./views/Loading";
import RankingViewDetails from "./views/Ranking/RankingViewDetails";

const Default = lazy(() => import("./layouts/Default"));
const Home = lazy(() => import("./views/Home"));
const BetCreate = lazy(() => import("./views/Bets/BetCreate"));
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
    "Mgo+DSMBaFt/QHRqVVhkVFpHaVZdX2NLfUNzT2dQdVpzZCQ7a15RRnVfQF1kS35QcUdnWXlXcA==;Mgo+DSMBPh8sVXJ0S0J+XE9AflRBQmpWfFN0RnNcdVp5flFFcC0sT3RfQF5jS35UdEVgXn1acXdWRg==;ORg4AjUWIQA/Gnt2VVhkQlFacldJXnxAYVF2R2BJelR0fV9CY0wgOX1dQl9gSXxTcUdjWnhcdHZcRWM=;MTA4Mzk3MkAzMjMwMmUzNDJlMzBqK2VrdktxUXg1RmtnZ2xIQ1lmZkRZZmZwclNqd0orMXk2eFFCQ0RmNU93PQ==;MTA4Mzk3M0AzMjMwMmUzNDJlMzBHcGp4L2F2b2hXMVdDanhjeTBZSXRBRUdaNTJOeElVYTdaTXVxck4wT004PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmBWd0x0RWFab1t6cFxMZF9BNQtUQF1hSn5RdkJhWXxZcnBdTmhU;MTA4Mzk3NUAzMjMwMmUzNDJlMzBheWF0Q01EUnNUZmdCcUVkQWhoL3NFaUM3bmRpZ2xVQjREVDNSbEFPWEUwPQ==;MTA4Mzk3NkAzMjMwMmUzNDJlMzBJakV5UXZvdmNhbHp3cFl1dzNOa1V3UXhYNXBTSGhFSVk2RHVXanJENWlnPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXnxAYVF2R2BJelR0fV9CY0wgOX1dQl9gSXxTcUdjWnhcdXdWQWE=;MTA4Mzk3OEAzMjMwMmUzNDJlMzBTZ3g0cHVSMUJFUDNyUVFzdFBQR21adnh2cUxFcWVOZW1yc0RDNkovZitVPQ==;MTA4Mzk3OUAzMjMwMmUzNDJlMzBjdnpUa21SN1E3Smp0RUNoNTdQQldkdjFjdnc3OEtGQzhEa2V2QnRrRzhrPQ==;MTA4Mzk4MEAzMjMwMmUzNDJlMzBheWF0Q01EUnNUZmdCcUVkQWhoL3NFaUM3bmRpZ2xVQjREVDNSbEFPWEUwPQ=="
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        dispatch(getAllMatchesReducerAsync());
        dispatch(getAllCommentsReducerAsync());
        dispatch(getAllUsersReducerAsync());
        dispatch(getAllTeamsReducerAsync(accessToken));
        dispatch(getAllBetsReducerAsync(accessToken));
      }}
    >
      <Toaster
        toastOptions={{ className: "font-[calibri] text-[16px] mt-[40px]" }}
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
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
