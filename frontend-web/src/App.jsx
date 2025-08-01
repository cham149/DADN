import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";
import Profile from "./page/Profile";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:userID" element={<Profile />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;