import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Navbar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-light bg-light px-4 py-3 d-flex justify-content-between align-items-center w-100">
      <div className="d-flex align-items-center" style={{ gap: "15px" }}>
        <button
          className="border-0 bg-transparent p-0"
          onClick={toggleSidebar}
          style={{ fontSize: "22px", cursor: "pointer", color: "#000000" }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span className="navbar-brand mb-0 h5 text-dark">
          Welcome Promotion2
        </span>
      </div>

      <button type="button" className="btn btn-primary" onClick={() => navigate("/create-workflow") }>
        <span className="me-2">&#43;</span> Create New Work Flow
      </button>
    </nav>
  );
};

export default Navbar;
