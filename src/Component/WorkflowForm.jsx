import React from "react";
import { ReactFlow } from "@reactflow/core";
import { Background } from "@reactflow/background";
import { Controls } from "@reactflow/controls";
import { MiniMap } from "@reactflow/minimap";

// Don't forget the CSS for each
import "@reactflow/core/dist/style.css";
import "@reactflow/controls/dist/style.css";
import "@reactflow/minimap/dist/style.css";

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
