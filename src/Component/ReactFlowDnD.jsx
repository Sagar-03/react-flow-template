
import React, { useCallback, useState, useEffect, useMemo } from "react";
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate, useLocation } from "react-router-dom";
import MenuNode from "./MenuNode.jsx";
import MenuNodeSidebar from "./MenuNodeSidebar.jsx";
// import "../Component/MenuNode.css";
// import "./ReactFlowDnD.css";
import { useDnD } from "../Utils/DnDContext.jsx";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start Node" },
    position: { x: 250, y: 5 },
  },
];

const initialEdges = [];

const DnDPanel = ({ onDragStart }) => {
  const [type, setType, addNodeByClick] = useDnD();
  
  return (
    <aside className="p-3 bg-white border-end position-relative d-flex flex-column" 
           style={{ 
             width: "200px",
             borderRight: "1px solid #dee2e6",
             height: "100%"
           }}>
      
      <div
        className="p-3 bg-white mb-3 text-dark fw-normal text-center d-flex align-items-center justify-content-center"
        style={{ 
          cursor: "grab",
          border: "1px solid #007bff",
          borderRadius: "4px",
          minHeight: "48px"
        }}
        onDragStart={(event) => onDragStart(event, "input")}
        onClick={() => addNodeByClick("input")}
        draggable
      >
        <span>Input Node</span>
      </div>
      
      <div
        className="p-3 bg-white mb-3 text-dark fw-normal text-center d-flex align-items-center justify-content-center"
        style={{ 
          cursor: "grab",
          border: "1px solid #6c757d",
          borderRadius: "4px",
          minHeight: "48px"
        }}
        onDragStart={(event) => onDragStart(event, "default")}
        onClick={() => addNodeByClick("default")}
        draggable
      >
        <span>Default Node</span>
      </div>
      
      <div
        className="p-3 bg-white mb-3 text-dark fw-normal text-center d-flex align-items-center justify-content-center"
        style={{ 
          cursor: "grab",
          border: "1px solid #e91e63",
          borderRadius: "4px",
          minHeight: "48px"
        }}
        onDragStart={(event) => onDragStart(event, "output")}
        onClick={() => addNodeByClick("output")}
        draggable
      >
        <span>Output Node</span>
      </div>
      
      <div
        className="p-3 bg-white mb-3 text-dark fw-normal text-center d-flex align-items-center justify-content-center"
        style={{ 
          cursor: "grab",
          border: "1px solid #ff6b35",
          borderRadius: "4px",
          minHeight: "48px"
        }}
        onDragStart={(event) => onDragStart(event, "menu")}
        onClick={() => addNodeByClick("menu")}
        draggable
      >
        <span>Menu Node</span>
      </div>
    </aside>
  );
};

const ReactFlowDnD = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startPoint: "",
    trigger: "text",
    status: "Active",
  });
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get context values for managing nodes
  const [type, setType, addNodeByClick, clickedNodeType, setNodePositions] = useDnD();
  
  // Handle workflow data from navigation state
  useEffect(() => {
    if (location.state && location.state.workflow) {
      setCurrentWorkflow(location.state.workflow);
      console.log('Loaded workflow:', location.state.workflow);
    }
  }, [location.state]);
  
  // Save workflows to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  // Initialize node positions in context when nodes change
  useEffect(() => {
    const positions = nodes.map(node => node.position);
    setNodePositions(positions);
  }, [nodes, setNodePositions]);

  // Handle adding nodes when clicked (from context)
  useEffect(() => {
    if (clickedNodeType) {
      const { type, position } = clickedNodeType;
      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data:
          type === "menu"
            ? { items: [{ id: "item-1", label: "Item 1" }] }
            : { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [clickedNodeType, setNodes]);

  // Handle sidebar open
  const handleOpenSidebar = (nodeInfo) => {
    setSelectedNodeData(nodeInfo);
    setSidebarOpen(true);
  };

  // Handle sidebar close
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedNodeData(null);
  };

  // Handle node update from sidebar
  const handleUpdateNode = (nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
    
    // Update edges if items changed
    if (updates.items) {
      const itemIds = updates.items.map(item => item.id);
      
      // Remove edges for deleted items
      setEdges((eds) => eds.filter((edge) => {
        if (edge.source === nodeId) {
          return itemIds.includes(edge.sourceHandle);
        }
        return true;
      }));
      
      // Update edge labels for existing items
      setEdges((eds) => eds.map((edge) => {
        if (edge.source === nodeId) {
          const item = updates.items.find(item => item.id === edge.sourceHandle);
          if (item) {
            return { ...edge, label: item.label };
          }
        }
        return edge;
      }));
    }
  };

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      animated: true,
      style: { stroke: '#6c63ff', strokeWidth: 2 },
      labelStyle: { fill: '#6c63ff', fontWeight: 600 },
      deletable: true,
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    // Show a brief visual feedback before deletion
    const edgeElement = event.target.closest('.react-flow__edge');
    if (edgeElement) {
      edgeElement.style.opacity = '0.5';
      edgeElement.style.transition = 'opacity 0.2s ease';
    }
    
    setTimeout(() => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }, 100);
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowInstance) return;
      
      // Use screenToFlowPosition instead of deprecated project method
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data:
          type === "menu"
            ? { items: [{ id: "item-1", label: "Item 1" }] }
            : { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const now = new Date();
    const workflow = {
      ...form,
      nodes: nodes,
      edges: edges,
      createdOn: now.toISOString().slice(0, 19).replace("T", " "),
      updatedOn: now.toISOString().slice(0, 19).replace("T", " "),
    };
    setWorkflows([workflow, ...workflows]);
    setForm({ name: "", startPoint: "", trigger: "text", status: "Active" });
    setShowForm(false);
    
    // Navigate to home to see the cards
    navigate("/");
  };

  // Memoize nodeTypes with sidebar handler
  const memoizedNodeTypes = useMemo(() => ({
    menu: (props) => <MenuNode {...props} onOpenSidebar={handleOpenSidebar} />,
  }), []);

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
        <div>
          <h4 className="mb-0">Flow Designer</h4>
          {currentWorkflow && (
            <small className="text-muted">
              Editing: {currentWorkflow.name} | Start Point: {currentWorkflow.startPoint}
            </small>
          )}
        </div>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          Save Workflow
        </button>
      </div>
      
      <div className="d-flex flex-grow-1">
        <DnDPanel onDragStart={onDragStart} />
        <div className="flex-grow-1 position-relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={memoizedNodeTypes}
            edgesReconnectable={true}
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
      
      {/* Menu Node Sidebar */}
      <MenuNodeSidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        nodeData={selectedNodeData?.nodeData}
        nodeId={selectedNodeData?.nodeId}
        onUpdateNode={handleUpdateNode}
      />
      
      {showForm && (
        <div className="workflow-form-modal">
          <div className="workflow-form-content">
            <button
              className="workflow-form-close"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-3">Save Workflow</h2>
            <form onSubmit={handleSave}>
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
              <button type="submit" className="btn btn-primary">Save Workflow</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactFlowDnD;
