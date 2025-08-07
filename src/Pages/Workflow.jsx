
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowCard from "../Component/WorkflowCard";


const Workflow = () => {
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    startPoint: "",
    trigger: "text",
    status: "Active",
  });
  const [showModal, setShowModal] = useState(false);

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
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Create New Work Flow
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 32,
            minWidth: 350,
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              style={{ position: 'absolute', top: 10, right: 10, border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer' }}
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-3">Create New Workflow</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Bot Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Start Point</label>
                <input
                  type="text"
                  className="form-control"
                  name="startPoint"
                  value={form.startPoint}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trigger Type</label>
                <select
                  className="form-select"
                  name="trigger"
                  value={form.trigger}
                  onChange={handleChange}
                >
                  <option value="text">text</option>
                  <option value="dynamic">dynamic</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Create Workflow</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {workflows.map((wf, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
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

export default Workflow;
