import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import WorkflowCard from "../Component/WorkflowCard"; // Remove this line

const Workflow = () => {
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  // Removed form and modal state

  useEffect(() => {
    // Update localStorage whenever workflows change
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const workflow = {
      ...form,
      createdOn: now.toISOString().slice(0, 19).replace("T", " "),
      updatedOn: now.toISOString().slice(0, 19).replace("T", " "),
    };
    const updatedWorkflows = [workflow, ...workflows];
    setWorkflows(updatedWorkflows);
    setForm({ name: "", startPoint: "", trigger: "text", status: "Active" });
    setShowModal(false);
    // Redirect to React Flow page (assuming route is '/workflow')
    navigate("/workflow", {
      state: { workflow, index: 0 }, // Pass the new workflow and index
    });
  };

  const handleDelete = (index) => {
    const updated = [...workflows];
    updated.splice(index, 1);
    setWorkflows(updated);
  };

  const handleEdit = (index) => {
    alert("Edit workflow " + (workflows[index]?.name || index));
  };

  return (
    <div className="container-fluid p-4">
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/workflow")}
      >
        Create New Work Flow
      </button>

      <div className="row">
        {workflows.map((wf, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
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

export default Workflow;