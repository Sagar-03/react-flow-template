import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Leftsidebar from "./Component/Leftsidebar";
import Home from "./Pages/Home";
import CreateWorkflow from "./Pages/CreateWorkflow";

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <Router>
      <div className="d-flex">
        <Leftsidebar isOpen={isOpen} />
        <div className="flex-grow-1">
          <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-workflow" element={<CreateWorkflow />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;