import axios from "axios";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import ErrorFallback from "./components/ErrorFallback";
import ScrollToTop from "./components/ScrollToTop";
import { routes } from "./constants";
import { getAllBetsReducerAsync } from "./state/betSlice";
import { getAllCommentsReducerAsync } from "./state/commentSlice";
import { getAllMatchesReducerAsync } from "./state/matchSlice";
import { getAllTeamsReducerAsync } from "./state/teamSlice";
import { getAllUsersReducerAsync, selectUser } from "./state/userSlice";
import BetViewAll from "./views/Bets/BetViewAll";
import Loading from "./views/Loading";
import RankingViewDetails from "./views/Ranking/RankingViewDetails";

const Default = lazy(() => import("./layouts/Default"));
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
  const { user, accessToken } = useSelector(selectUser);
  // Initial navigate
  const navigate = useNavigate();

  // Set axios defaults
  axios.defaults.baseURL = "http://localhost:8000/api";
  axios.defaults.headers.common = `Bearer ${accessToken}`;

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        if (!user) navigate("/login");

        dispatch(getAllMatchesReducerAsync(accessToken));
        dispatch(getAllCommentsReducerAsync());
        dispatch(getAllUsersReducerAsync(accessToken));
        dispatch(getAllTeamsReducerAsync(accessToken));
        dispatch(getAllBetsReducerAsync(accessToken));
      }}
    >
      <Toaster toastOptions={{ className: "font-[calibri] text-[16px]" }} />

      <ScrollToTop />

      <Suspense fallback={<Loading />}>
        <Routes>
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
