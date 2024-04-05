import "./App.css";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Auth from "./utils/Auth";
import Signup from "./components/signup/Signup";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <AnimatePresence mode="wait">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Auth />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AnimatePresence>
  );
}

export default App;
