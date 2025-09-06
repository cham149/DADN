import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import UserCard from "./components/UserCard";
import HumanResources from "./components/HumanResources";
import Post from "./components/Post";
import Report from "./components/Report";
import Reported from "./components/Reported";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/usercard" element={<UserCard />} />
        <Route path="/humanresources" element={<HumanResources />} />
        <Route path="/post" element={<Post />} />
        <Route path="/report" element={<Report />} />
        <Route path="/reported" element={<Reported />} />

      </Routes>
    </Router>
  );
}

export default App;
