import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { defaultLayout } from "./constants";
import Default from "./layouts/Default";
import { NotFound } from "./views";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.headers.common = `Bearer ${JSON.parse(
  localStorage.getItem("persist:user")
)?.accessToken.replaceAll('"', "")}`;

function App() {
  return (
    <div>
      <Toaster />

      <Routes>
        <Route element={<Default />}>
          {defaultLayout.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
