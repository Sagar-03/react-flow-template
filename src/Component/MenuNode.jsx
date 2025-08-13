import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import MenuNodeSidebar from './MenuNodeSidebar';
import './Menunode.css';
import { createPortal } from 'react-dom';

export default function MenuNode({ data, id }) {
  const [showSidebar, setShowSidebar] = useState(false);

  // Items list (menu options)
  const items = data?.items || [];

  const handleItemsChange = (newItems) => {
    if (data?.onChange) {
      data.onChange(newItems, id);
    }
  };

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSidebar) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSidebar]);

  // Dynamic node size
  const nodeHeight = useMemo(() => {
    const baseHeight = 100;
    const extraHeight = items.length * 25; // grows with handles
    return baseHeight + extraHeight;
  }, [items.length]);

  const nodeWidth = useMemo(() => {
    const baseWidth = 150;
    const extraWidth = items.length > 0 ? items.length * 20 : 0; // grow width with bottom handles
    return baseWidth + extraWidth;
  }, [items.length]);

  return (
    <>
      <div
        className="menu-node"
        style={{
          height: nodeHeight,
          width: nodeWidth
        }}
      >
        {/* Fixed input handles */}
        <Handle type="target" position={Position.Top} id="input-top" className="input-handle" />
        <Handle type="target" position={Position.Left} id="input-left" className="input-handle" />

        {/* Icon + labels */}
        <div className="icon-circle">
          <div className="icon-line"></div>
          <div className="icon-line"></div>
          <div className="icon-line"></div>
        </div>
        <div className="title">Menu </div>
        {/* <div className="subtitle">Display menu options</div> */}

        {/* Pen icon for editing */}
        <div 
          className="pen-icon"
          onClick={() => setShowSidebar(true)}
          title={`Edit menu (${items.length} items)`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </div>

        {/* Output handles — create BOTH right + bottom for each item */}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* Right side */}
            <Handle
              type="source"
              position={Position.Right}
              id={`right-${index}`}
              className="output-handle"
              style={{
                top: `${40 + index * 25}px`
              }}
              title={item}
              isConnectable={true}
            />
            {/* Bottom side */}
            <Handle
              type="source"
              position={Position.Bottom}
              id={`bottom-${index}`}
              className="output-handle"
              style={{
                left: `${30 + index * 25}px`
              }}
              title={item}
              isConnectable={true}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Sidebar portal */}
      {showSidebar && createPortal(
        <MenuNodeSidebar
          items={items}
          setItems={handleItemsChange}
          onClose={() => setShowSidebar(false)}
          isOpen={showSidebar}
        />,
        document.body
      )}
    </>
  );
}
