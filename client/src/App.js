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
const UserViewDetails = lazy(() => import("./views/Users/UserViewDetails"));

function App() {
  // Initial dispatch
  const dispatch = useDispatch();
  // Get user logged from global state
  const { accessToken } = useSelector(selectUser);

  // Set axios defaults
  axios.defaults.baseURL = "http://localhost:8000/api";
  axios.defaults.headers.common = `Bearer ${accessToken}`;

  // Registering Syncfusion license key
  registerLicense(
    "Mgo+DSMBaFt/QHRqVVhkXVpGaV1dX2NLfUN/T2BfdVt0ZDU7a15RRnVfQ11gS3xQckRjW3lccw==;Mgo+DSMBPh8sVXJ0S0J+XE9Ad1RAQmFWfFN0RnNQdV12flBCcDwsT3RfQF5jSH5QdEdgXX5ecnNQRQ==;ORg4AjUWIQA/Gnt2VVhkQlFacl5JX3xLYVF2R2BJdlRzcl9DZEwxOX1dQl9gSX9TdUdhWntfcHZdQWM=;ODY4NzY5QDMyMzAyZTM0MmUzMGQvMXBVSDg4bEdPQWdVS2RZZDdIakV0Yks2SndPVmVHUHhHSHprelVLcms9;ODY4NzcwQDMyMzAyZTM0MmUzMEtEdS9ZNWNuNU1FN2lwWlNwaHViaXRkdjJ6REJIUWpKT0NtOGJ2NU83MkU9;NRAiBiAaIQQuGjN/V0Z+WE9EaFtDVmFWfEx0RWFab1d6d1NMZVhBJAtUQF1hSn5SdkZhW3xacXRWQmRf;ODY4NzcyQDMyMzAyZTM0MmUzMGpESUtFeTlLRnhKWFNmbFJIOW9weTVQUDVOc2w1NGNzS3RvbzQvc0NHT1U9;ODY4NzczQDMyMzAyZTM0MmUzMG9vRWVlMnFTaHAzaCtsSktRZ3BUQlI2ckUyVUNVYlMxSXVCOE00K3RWcDg9;Mgo+DSMBMAY9C3t2VVhkQlFacl5JX3xLYVF2R2BJdlRzcl9DZEwxOX1dQl9gSX9TdUdhWntfcHBVTmM=;ODY4Nzc1QDMyMzAyZTM0MmUzMGZKVmRoNURYbDcxZUtYdWg0SzJlYjh2M1pEY2ZOZm1wME5PS1RzbW9yNjQ9;ODY4Nzc2QDMyMzAyZTM0MmUzMGkvdlM4ZDdDS0E2Y05BOHBXMll6UURyb2VTeklMOUxWTWl3eWtsSS81L0E9;ODY4Nzc3QDMyMzAyZTM0MmUzMGpESUtFeTlLRnhKWFNmbFJIOW9weTVQUDVOc2w1NGNzS3RvbzQvc0NHT1U9"
  );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        dispatch(getAllMatchesReducerAsync(accessToken));
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
