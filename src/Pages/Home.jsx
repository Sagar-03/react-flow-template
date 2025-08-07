import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowCard from "../Component/WorkflowCard";

const Home = () => {
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Update localStorage whenever workflows change
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  const handleDelete = (index) => {
    const updated = [...workflows];
    updated.splice(index, 1);
    setWorkflows(updated);
  };

  const handleEdit = (index) => {
    // Navigate to ReactFlow with the saved workflow data
    navigate("/workflow", { state: { workflow: workflows[index], index } });
  };

  return (
    <div className="container-fluid">
      <div className="row p-4">
        {workflows.map((wf, idx) => (
          <div className="col-md-4" key={idx}>
            <WorkflowCard
              workflow={wf}
              onEdit={() => handleEdit(idx)}
              onDelete={() => handleDelete(idx)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
