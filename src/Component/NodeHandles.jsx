import React from 'react';
import { Handle, Position } from '@xyflow/react';

// This component renders handles on all four sides of a node
// You can specify how many handles per side
export const NodeHandles = ({ 
  top = 1, 
  right = 1, 
  bottom = 1, 
  left = 1,
  data = {},
  className = '',
  nodeType = 'default',
  items = []
}) => {
  // Generate positions for handles evenly spaced on each side
  const generateHandlePositions = (count) => {
    if (count <= 1) return [50]; // If only one handle, place in the middle
    
    // Same behavior for all positions
    const step = 100 / (count + 1);
    return Array.from({ length: count }, (_, i) => (i + 1) * step);
  };
  
  // Handle special node types
  let topCount = top;
  let rightCount = right;
  let bottomCount = bottom;
  let leftCount = left;
  
  // For menu nodes, only right and bottom edges should increase with items
  if (nodeType === 'menu' && items && items.length > 0) {
    // Input edges (top and left) remain fixed
    // Output edges (right and bottom) change with items
    rightCount = items.length;
    bottomCount = items.length;
  }
  
  const topPositions = generateHandlePositions(topCount);
  const rightPositions = generateHandlePositions(rightCount);
  const bottomPositions = generateHandlePositions(bottomCount);
  const leftPositions = generateHandlePositions(leftCount);

  return (
    <>
      {/* Top handles - always fixed input handles */}
      {topPositions.map((percentage, index) => (
        <Handle
          key={`top-${index}`}
          type="target"
          position={Position.Top}
          id={`top-${index}`}
          className={className}
          style={{ left: `${percentage}%` }}
        />
      ))}
      
      {/* Right handles - dynamic output handles for menu items */}
      {rightPositions.map((percentage, index) => (
        <Handle
          key={`right-${index}`}
          type="source"
          position={Position.Right}
          id={nodeType === 'menu' && items[index] ? `item-${index}` : `right-${index}`}
          className={className}
          style={{ top: `${percentage}%` }}
        />
      ))}
      
      {/* Bottom handles - dynamic output handles for menu items */}
      {bottomPositions.map((percentage, index) => (
        <Handle
          key={`bottom-${index}`}
          type="source"
          position={Position.Bottom}
          id={nodeType === 'menu' && items[index] ? `bottom-item-${index}` : `bottom-${index}`}
          className={`${className} bottom-handle menu-node-handle`}
          style={{ 
            left: `${percentage}%`,
            bottom: '-5px', // Position slightly outside the node for better interaction
            zIndex: 1000,
            pointerEvents: 'all'
          }}
        />
      ))}
      
      {/* Left handles - always fixed input handles */}
      {leftPositions.map((percentage, index) => (
        <Handle
          key={`left-${index}`}
          type="target"
          position={Position.Left}
          id={`left-${index}`}
          className={className}
          style={{ top: `${percentage}%` }}
        />
      ))}
    </>
  );
};

export default NodeHandles;
