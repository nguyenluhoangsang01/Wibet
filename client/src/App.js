import axios from "axios";
import { Route, Routes } from "react-router-dom";
import { defaultLayout } from "./constants";
import Default from "./layouts/Default";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.headers.common = `Bearer ${JSON.parse(
  localStorage.getItem("persist:user")
)?.accessToken.replaceAll('"', "")}`;

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Default />}>
          {defaultLayout.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
