import React, { useState } from "react";
import {
  FaHome,
  FaBars,
  FaTimes,
  FaQuestionCircle
} from "react-icons/fa";
import { PiPlugsBold } from "react-icons/pi";
import { FaShareNodes } from "react-icons/fa6";
import logo from "../assets/logo.svg"; // Make sure your image is placed correctly

const Leftsidebar = ({ isOpen }) => {
  return (
    <div
      className="bg-white border-end shadow-sm d-flex flex-column align-items-center"
      style={{
        width: isOpen ? "220px" : "70px",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        position: "relative",
      }}
    >
      {/* Logo */}
      <div className="d-flex justify-content-start align-items-center w-100 p-3" style={{ gap: "10px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain",
          }}
        />
        {isOpen && (
          <span style={{ fontSize: "20px", fontWeight: 500, color: "#5C527A" }}>
            authkey
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <div className="nav flex-column p-3 w-100">
        <SidebarItem icon={<FaHome />} text="Home" isOpen={isOpen} />
        <SidebarItem icon={<FaShareNodes />} text="Workflow" isOpen={isOpen} />
        <SidebarItem icon={<FaQuestionCircle />} text="FAQ" isOpen={isOpen} />
        <SidebarItem icon={<PiPlugsBold />} text="Connection" isOpen={isOpen} />
      </div>
    </div>
  );
};


// Sidebar item component
const SidebarItem = ({ icon, text, isOpen }) => (
  <button
    className="btn btn-light text-start d-flex align-items-center mb-2 w-100"
    style={{
      gap: "10px",
      padding: "10px 12px",
      fontSize: "15px",
      borderRadius: "8px",
    }}
  >
    {icon}
    {isOpen && <span>{text}</span>}
  </button>
);


export default Leftsidebar;