import React from 'react';
import { useDnD } from '../Utils/DnDContext';
import './Menunode.css';
import './NodeSidebar.css';

const NodeSidebar = () => {
  const [_, setNodeType] = useDnD();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setNodeType(nodeType);
  };

  const onDragEnd = () => setNodeType(null);

  return (
    <div className="node-sidebar">
      {/* <p className="hint">You can drag these nodes to the pane on the right.</p> */}

      {/* Start Node */}
      <div
        className="dnd-item start"
        draggable
        onDragStart={(e) => onDragStart(e, 'startNode')}
        onDragEnd={onDragEnd}
        style={{ backgroundColor: '#10b981', color: 'white', border: '2px solid #059669' }}
      >
        <div className="icon-circle small" style={{ backgroundColor: '#ffffff', color: '#10b981' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
          </svg>
        </div>
        <span>Start Node</span>
      </div>

      {/* Menu Node */}
      <div
        className="dnd-item default"
        draggable
        onDragStart={(e) => onDragStart(e, 'menuNode')}
        onDragEnd={onDragEnd}
      >
        <div className="icon-circle small">
          <div className="icon-line"></div>
          <div className="icon-line"></div>
          <div className="icon-line"></div>
        </div>
        <span>Menu Node</span>
      </div>

      {/* End Node */}
      <div
        className="dnd-item end"
        draggable
        onDragStart={(e) => onDragStart(e, 'endNode')}
        onDragEnd={onDragEnd}
        style={{ backgroundColor: '#ef4444', color: 'white', border: '2px solid #dc2626' }}
      >
        <div className="icon-circle small" style={{ backgroundColor: '#ffffff', color: '#ef4444' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0A.5.5 0 0 1 8.5 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </div>
        <span>End Node</span>
      </div>

      {/* Add more types here if/when you have them:
      <div
        className="dnd-item input"
        draggable
        onDragStart={(e) => onDragStart(e, 'inputNode')}
        onDragEnd={onDragEnd}
      >
        Input Node
      </div>

      <div
        className="dnd-item output"
        draggable
        onDragStart={(e) => onDragStart(e, 'outputNode')}
        onDragEnd={onDragEnd}
      >
        Output Node
      </div>
      */}
    </div>
  );
};

export default NodeSidebar;
