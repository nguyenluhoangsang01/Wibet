import { Route, Routes } from "react-router-dom";
import Default from "./layouts/Default";
import {
	Account,
	Analysis,
	Brackets,
	Comments,
	Home,
	Login,
	Matches,
	Profile,
	Ranking,
	Rules,
	Team,
	Users
} from "./views";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Default />}>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/brackets" element={<Brackets />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/users" element={<Users />} />
          <Route path="/team" element={<Team />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
