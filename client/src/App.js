import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { routes } from "./constants";
import Default from "./layouts/Default";
import {
	TeamCreate,
	TeamUpdate,
	UserCreate,
	UserUpdate,
	UserViewDetails
} from "./views";
import MatchUpdateInfo from "./views/Matches/MatchUpdateInfo";
import MatchUpdateScore from "./views/Matches/MatchUpdateScore";
import MatchViewDetails from "./views/Matches/MatchViewDetails";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.headers.common = `Bearer ${JSON.parse(
  localStorage.getItem("persist:user")
)?.accessToken?.replaceAll('"', "")}`;

function App() {
  return (
    <div>
      <Toaster />

      <Routes>
        <Route element={<Default />}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
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

          {/* Nested routes of user */}
          <Route path="/users/create" element={<UserCreate />} />
          <Route path="/users/:id/view-details" element={<UserViewDetails />} />
          <Route path="/users/:id/update" element={<UserUpdate />} />

          {/* Nested routes of team */}
          <Route path="/teams/create" element={<TeamCreate />} />
          <Route path="/teams/:id/update" element={<TeamUpdate />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
