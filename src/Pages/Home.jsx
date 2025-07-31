import React, { useState } from "react";
import WorkflowCard from "../Component/WorkflowCard";

const Home = () => {
  const [workflows, setWorkflows] = useState([]);

  const handleDelete = (index) => {
    const updated = [...workflows];
    updated.splice(index, 1);
    setWorkflows(updated);
  };

  const handleEdit = (index) => {
    // You can implement edit navigation or modal here
    alert("Edit workflow " + (workflows[index]?.name || index));
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
