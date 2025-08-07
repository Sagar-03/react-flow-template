import React, { useState, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { FaEdit } from "react-icons/fa";

const MenuNode = ({ id, data, selected, onOpenSidebar }) => {
  const initialItems = data.items && data.items.length > 0 ? data.items : [{ id: "item-1", label: "Initial Item" }];
  const [items, setItems] = useState(initialItems);
  const [inputValue, setInputValue] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");

  const nodeRef = useRef(null);
  const { setNodes, setEdges, getEdges } = useReactFlow();

  // Update items when data changes
  useEffect(() => {
    if (data.items && JSON.stringify(data.items) !== JSON.stringify(items)) {
      setItems(data.items);
    }
  }, [data.items]);

  // Update items when data changes
  useEffect(() => {
    if (data.items && JSON.stringify(data.items) !== JSON.stringify(items)) {
      setItems(data.items);
    }
  }, [data.items]);

  // Add new item + edge
  const addItem = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem = { id: `${id}-item-${Date.now()}`, label: inputValue };
    const newItems = [...items, newItem];

    setItems(newItems);
    setInputValue("");

    // Update node's data
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, items: newItems } } : n
      )
    );

    // Create edge to the first available node (if any)
    const allNodes = getEdges();
    const existingTargets = allNodes.filter(edge => edge.source === id).map(edge => edge.target);
    
    // Add new edge (you can customize the target logic here)
    setEdges((eds) => [
      ...eds,
      {
        id: `edge-${newItem.id}`,
        source: id,
        sourceHandle: newItem.id,
        target: existingTargets[0] || "placeholder", // Connect to first existing target or placeholder
        label: newItem.label,
        animated: true,
        style: { stroke: '#6c63ff', strokeWidth: 2 },
      },
    ]);
  };

  // Open sidebar to edit the node
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onOpenSidebar) {
      onOpenSidebar({
        nodeId: id,
        nodeData: data,
        items: items
      });
    }
  };

  // Remove item and edge
  const removeItem = (itemId) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, items: newItems } } : n
      )
    );

    setEdges((eds) => eds.filter((e) => e.sourceHandle !== itemId));
  };

  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditingLabel(item.label);
  };

  const saveEditedItem = (itemId) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, label: editingLabel } : item
    );
    setItems(newItems);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, items: newItems } } : n
      )
    );

    setEdges((eds) =>
      eds.map((e) =>
        e.sourceHandle === itemId ? { ...e, label: editingLabel } : e
      )
    );

    setEditingItemId(null);
    setEditingLabel("");
  };

  return (
    <div
      ref={nodeRef}
      className={`menu-node${selected ? " selected" : ""}`}
      style={{
        minWidth: 340,
        background: "#fff",
        border: "2px solid #6c63ff",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(108,99,255,0.08)",
        padding: 0,
        position: "relative",
        overflow: "visible",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 18px 0 18px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 28 }}>Menu Items</div>
        <button
          onClick={handleEditClick}
          style={{
            background: "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#5a52d5"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#6c63ff"}
          title="Edit Menu Items"
        >
          <FaEdit size={14} />
          Edit
        </button>
      </div>
      <hr
        style={{
          margin: "12px 0 0 0",
          border: 0,
          borderTop: "2px solid #f2f2f2",
        }}
      />
      <div style={{ padding: 18, paddingBottom: 0 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffeaea",
              borderRadius: 10,
              marginBottom: 12,
              padding: "8px 16px",
              fontSize: 28,
              fontWeight: 500,
              position: "relative",
            }}
          >
            <span style={{ color: "#ff3d3d", fontSize: 32, marginRight: 12 }}>●</span>

            {editingItemId === item.id ? (
              <input
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onBlur={() => saveEditedItem(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEditedItem(item.id);
                }}
                autoFocus
                style={{
                  fontSize: 24,
                  padding: "4px 8px",
                  flex: 1,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
            ) : (
              <span onDoubleClick={() => startEditing(item)}>{item.label}</span>
            )}

            <button
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "#ff3d3d",
                fontSize: 28,
                cursor: "pointer",
                position: "absolute",
                right: 36,
                top: 8,
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              title="Remove"
            >
              ×
            </button>

            <Handle
              type="source"
              position={Position.Right}
              id={item.id}
              style={{
                top: "50%",
                right: -8,
                background: "#6c63ff",
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        ))}
      </div>
      <form
        onSubmit={addItem}
        style={{
          display: "flex",
          margin: "0 18px",
          marginBottom: 0,
          marginTop: 8,
        }}
      >
        <input
          type="text"
          placeholder="Add new item..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            flex: 1,
            fontSize: 22,
            padding: "8px 12px",
            border: "1.5px solid #e0e0e0",
            borderRadius: "8px 0 0 8px",
            outline: "none",
            background: "#fafbfc",
          }}
        />
        <button
          type="submit"
          style={{
            fontSize: 22,
            background: "#0047ff",
            color: "#fff",
            border: "none",
            borderRadius: "0 8px 8px 0",
            padding: "0 24px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>
      <div style={{ color: "#888", fontSize: 20, margin: "18px 0 0 18px" }}>Menu Node</div>
      <Handle
        type="target"
        position={Position.Left}
        id="menu-in"
        style={{
          top: "50%",
          left: -8,
          background: "#6c63ff",
          width: 12,
          height: 12,
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default MenuNode;
