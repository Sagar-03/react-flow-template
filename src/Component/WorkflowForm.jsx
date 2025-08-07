import React from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";

// Import the unified CSS
import "@xyflow/react/dist/style.css";

const WorkflowForm = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
  return (
    <div style={{ height: "500px", border: "1px solid #ccc", marginTop: "20px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default WorkflowForm;
