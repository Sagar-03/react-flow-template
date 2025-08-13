import React from 'react';
import { Handle, Position } from '@xyflow/react';
import './Menunode.css';

export default function EndNode({ data, id }) {
  return (
    <div
      className="menu-node end-node"
      style={{
        height: 100,
        width: 100,
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderRadius: '50%',
      }}
    >
      {/* Only input handles for end node */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="input-top" 
        className="input-handle"
        style={{ backgroundColor: '#dc2626' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="input-left" 
        className="input-handle"
        style={{ backgroundColor: '#dc2626' }}
      />

      {/* End icon */}
      <div className="icon-circle" style={{ backgroundColor: '#ffffff', color: '#ef4444', marginTop: '3px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0A.5.5 0 0 1 8.5 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </div>

      <div className="title" style={{ color: '#ffffff', fontWeight: 'light', marginTop: '3px' }}>End</div>
    </div>
  );
}
