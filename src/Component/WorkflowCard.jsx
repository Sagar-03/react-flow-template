import React from "react";

const WorkflowCard = ({ workflow, onEdit, onDelete }) => {
  return (
    <div className="card p-3 shadow-sm mb-3">
      <p className="text-success">{workflow.status || "Active"}</p>
      <h5>Bot Name: {workflow.name}</h5>
      <p>Start Point: {workflow.startPoint}</p>
      <p>Trigger type: {workflow.trigger}</p>
      <p>Created: {workflow.createdOn}</p>
      <p>Updated: {workflow.updatedOn}</p>
      <div className="d-flex justify-content-between">
        <button className="btn btn-sm btn-outline-primary" onClick={onEdit}>Edit</button>
        <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default WorkflowCard;
