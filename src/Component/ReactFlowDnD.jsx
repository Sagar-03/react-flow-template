import React, { useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'; // Updated import
import '@xyflow/react/dist/style.css';
import MenuNode from './MenuNode';
import StartNode from './StartNode';
import EndNode from './EndNode';
import NodeSidebar from './NodeSidebar';
import { useDnD, DnDProvider } from '../Utils/DnDContext';
import './Workflow.css';

// Define nodeTypes outside of the component to prevent recreation on each render
const nodeTypes = {
  menuNode: MenuNode,
  startNode: StartNode,
  endNode: EndNode,
};

const initialNodes = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 100, y: 100 },
    data: {},
  },
  {
    id: '1',
    type: 'menuNode',
    position: { x: 350, y: 100 },
    data: {
      items: ['Option 1', 'Option 2'],
    },
  },
];

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeType] = useDnD();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const [workflowName, setWorkflowName] = React.useState("");

  // Handle item changes from MenuNode
  const handleNodeDataChange = useCallback((updatedItems, nodeId) => {
    console.log('Node data change for', nodeId, ':', updatedItems);

    // Update the node's data
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              items: updatedItems,
            },
          };
        }
        return node;
      })
    );

    // Clean up edges that are connected to deleted handles
    setEdges((eds) =>
      eds.filter((edge) => {
        if (edge.source === nodeId) {
          // Keep default handle edges
          if (edge.sourceHandle === 'output-default') {
            return true;
          }
          // Extract handle index from handle ID
          const handleIndex = parseInt(edge.sourceHandle.replace('output-', ''));
          // Keep edge only if the handle index is still valid
          return handleIndex < updatedItems.length;
        }
        return true;
      })
    );

    // Update edge labels for existing connections
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === nodeId) {
          if (edge.sourceHandle === 'output-default') {
            // Update default handle label
            if (edge.label !== 'Default') {
              return { ...edge, label: 'Default' };
            }
          } else {
            const handleIndex = parseInt(edge.sourceHandle.replace('output-', ''));
            const item = updatedItems[handleIndex];
            if (item && edge.label !== item) {
              return { ...edge, label: item };
            }
          }
        }
        return edge;
      })
    );
  }, [setNodes, setEdges]);

  // Update node data with the onChange handler
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: handleNodeDataChange,
        },
      }))
    );
  }, [handleNodeDataChange, setNodes]);

  const onConnect = useCallback(
    (params) => {
      console.log('Connection params:', params);

      // Prevent self-connections (edges connecting a node to itself)
      if (params.source === params.target) {
        console.log('Self-connection prevented:', params);
        return; // Don't create the edge
      }

      // Find the source node to get the item label
      const sourceNode = nodes.find(node => node.id === params.source);
      let edgeLabel = '';

      if (sourceNode && sourceNode.data.items && params.sourceHandle) {
        if (params.sourceHandle === 'output-default') {
          edgeLabel = 'Default';
        } else {
          // Extract the index from the handle ID (e.g., "output-0" -> 0)
          const handleIndex = parseInt(params.sourceHandle.replace('output-', ''));
          const item = sourceNode.data.items[handleIndex];
          if (item) {
            edgeLabel = item;
          }
        }
      }

      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#7c3aed', strokeWidth: 2 },
        label: edgeLabel,
        labelStyle: { fill: '#7c3aed', fontWeight: 600 },
      };

      console.log('Creating edge:', newEdge);
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes]
  );

  // Handle dropping a node onto the canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle the drop event to create a new node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      // Get the node type from the dataTransfer
      const nodeType = event.dataTransfer.getData('application/reactflow');

      // Check if we're dropping a valid node type
      if (!nodeType) return;

      // Get the position where the node was dropped
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Generate a unique node ID based on type
      let newNodeId;
      let newNodeData = {};

      switch (nodeType) {
        case 'startNode':
          newNodeId = `start_${Date.now()}`;
          newNodeData = {};
          break;
        case 'endNode':
          newNodeId = `end_${Date.now()}`;
          newNodeData = {};
          break;
        case 'menuNode':
          newNodeId = `menu_${Date.now()}`;
          newNodeData = {
            items: ['New Option'], // Default items for new menu node
            onChange: handleNodeDataChange,
          };
          break;
        default:
          return;
      }

      // Create the new node
      const newNode = {
        id: newNodeId,
        type: nodeType,
        position,
        data: newNodeData,
      };

      // Add the new node to the graph
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, handleNodeDataChange]
  );

  return (
    <div className="workflow-container">
      <div className="workflow-header">
        <div>
          <h4>{workflowName}</h4>
        </div>
        <div>
          <button className="save-button">
            Save
          </button>
        </div>
      </div>
      
      <div className="workflow-content">
        <div className="dndflow">
          <NodeSidebar />
          <div 
            className="reactflow-wrapper" 
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              minZoom={0.5}
              maxZoom={1.5}
              defaultzoom={0.8}
              // Validate connections to prevent self-connections
              connectionLineStyle={{ stroke: '#7c3aed', strokeWidth: 2 }}
              isValidConnection={(connection) => {
                // Don't allow connections to the same node
                return connection.source !== connection.target;
              }}
            >
              <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
                style={{ width: 100, height: 60 }}
                position="bottom-left"
              />
              <Controls 
                showInteractive={false}
                position="bottom-right"
              />
              <Background gap={16} size={1} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReactDnd() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <FlowCanvas />
      </DnDProvider>
    </ReactFlowProvider>
  );
}