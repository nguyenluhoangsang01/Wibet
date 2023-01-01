import axios from "axios";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { routes } from "./constants";
import BetViewAll from "./views/Bets/BetViewAll";
import Loading from "./views/Loading";

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

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.headers.common = `Bearer ${JSON.parse(
  localStorage.getItem("persist:user")
)?.accessToken?.replaceAll('"', "")}`;

function App() {
  return (
    <div>
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
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
