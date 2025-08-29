import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Home from "./page/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
