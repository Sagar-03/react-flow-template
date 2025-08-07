import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactFlowProvider } from "reactflow"; // Import ReactFlowProvider
import Navbar from "./Component/Navbar";
import Leftsidebar from "./Component/Leftsidebar";
import Home from "./Pages/Home";
import CreateWorkflow from "./Pages/Workflow.jsx";
import ReactFlowDnD from "./Component/ReactFlowDnD.jsx";
import { DnDProvider } from "./Utils/DnDContext.jsx";

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <DnDProvider> {/* Wrap with DnDProvider */}
      <ReactFlowProvider> {/* Wrap with ReactFlowProvider */}
        <Router>
          <div className="d-flex" style={{ height: "100vh" }}>
            <Leftsidebar isOpen={isOpen} />
            <div className="flex-grow-1 d-flex flex-column">
              <Navbar isOpen={isOpen} toggleSidebar={toggleSidebar} />
              <div className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-workflow" element={<CreateWorkflow />} />
                  <Route path="/workflow" element={<ReactFlowDnD />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </ReactFlowProvider> {/* Close ReactFlowProvider */}
    </DnDProvider> 
  );
};

export default App;
