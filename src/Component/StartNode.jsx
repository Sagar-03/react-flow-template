import React from 'react';
import { Handle, Position } from '@xyflow/react';
import './Menunode.css';

export default function StartNode({ data, id }) {
  return (
    <div
      className="menu-node start-node"
      style={{
        height: 100,
        width: 100,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderRadius: '50%',
      }}
    >
      {/* Only output handles for start node */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output-right" 
        className="output-handle"
        style={{ backgroundColor: '#059669' }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="output-bottom" 
        className="output-handle"
        style={{ backgroundColor: '#059669' }}
      />

      {/* Start icon */}
      <div className="icon-circle" style={{ backgroundColor: '#ffffff', color: '#10b981' ,marginTop: '3px'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        </svg>
      </div>
      
      <div className="title" style={{ color: '#ffffff', fontWeight: 'bold', marginTop: '3px' }}>Start</div>
    </div>
  );
}
