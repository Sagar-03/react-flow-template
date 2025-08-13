import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import WorkflowCard from "../Component/WorkflowCard"; // Remove this line

const Home = () => {
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  const handleDelete = (index) => {
    const updated = [...workflows];
    updated.splice(index, 1);
    setWorkflows(updated);
  };

  const handleEdit = (index) => {
    navigate("/workflow", { state: { workflow: workflows[index], index } });
  };

  return (
    <div className="container-fluid">
      <div className="row p-4">
        {workflows.map((wf, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{wf.name}</h5>
                <p className="card-text">
                  <strong>Start Point:</strong> {wf.startPoint}<br />
                  <strong>Trigger:</strong> {wf.trigger}<br />
                  <strong>Status:</strong> {wf.status}<br />
                  <strong>Created On:</strong> {wf.createdOn}<br />
                  <strong>Updated On:</strong> {wf.updatedOn}
                </p>
                <button className="btn btn-primary me-2" onClick={() => handleEdit(idx)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;