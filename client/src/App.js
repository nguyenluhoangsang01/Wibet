import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { routes } from "./constants";
import Default from "./layouts/Default";

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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
