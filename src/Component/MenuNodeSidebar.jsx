import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const MenuNodeSidebar = ({ 
  isOpen, 
  onClose, 
  nodeData, 
  nodeId, 
  onUpdateNode 
}) => {
  const [items, setItems] = useState([]);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');

  // Update local items when nodeData changes
  useEffect(() => {
    if (nodeData && nodeData.items) {
      setItems(nodeData.items);
    }
  }, [nodeData]);

  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const newItem = {
      id: `${nodeId}-item-${Date.now()}`,
      label: newItemLabel.trim()
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemLabel('');
    
    // Update parent node
    onUpdateNode(nodeId, { items: updatedItems });
  };

  // Remove item
  const handleRemoveItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Update parent node
    onUpdateNode(nodeId, { items: updatedItems });
  };

  // Start editing
  const startEditing = (item) => {
    setEditingItem(item.id);
    setEditingLabel(item.label);
  };

  // Save edited item
  const saveEditedItem = () => {
    if (!editingLabel.trim()) return;

    const updatedItems = items.map(item =>
      item.id === editingItem 
        ? { ...item, label: editingLabel.trim() }
        : item
    );
    
    setItems(updatedItems);
    setEditingItem(null);
    setEditingLabel('');
    
    // Update parent node
    onUpdateNode(nodeId, { items: updatedItems });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
    setEditingLabel('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
        style={{
          width: '400px',
          zIndex: 1050,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          borderLeft: '1px solid #dee2e6'
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0 fw-bold">Edit Menu Items</h5>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Node Info */}
          <div className="mb-3 p-2 bg-light rounded">
            <small className="text-muted">Node ID: {nodeId}</small>
          </div>

          {/* Add New Item Form */}
          <form onSubmit={handleAddItem} className="mb-4">
            <label className="form-label fw-semibold">Add New Item</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter item label..."
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!newItemLabel.trim()}
              >
                <FaPlus className="me-1" />
                Add
              </button>
            </div>
          </form>

          {/* Items List */}
          <div>
            <h6 className="fw-semibold mb-3">Menu Items ({items.length})</h6>
            
            {items.length === 0 ? (
              <div className="text-center text-muted py-4">
                <p className="mb-0">No items yet</p>
                <small>Add your first menu item above</small>
              </div>
            ) : (
              <div className="list-group">
                {items.map((item, index) => (
                  <div key={item.id} className="list-group-item border rounded mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge bg-primary me-2">#{index + 1}</span>
                          <small className="text-muted">ID: {item.id}</small>
                        </div>
                        
                        {editingItem === item.id ? (
                          <div className="d-flex gap-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditedItem();
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={saveEditedItem}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="fw-medium">{item.label}</div>
                        )}
                      </div>
                      
                      {editingItem !== item.id && (
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => startEditing(item)}
                            title="Edit item"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-top mt-auto">
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <small className="text-muted align-self-center">
              Changes are saved automatically
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuNodeSidebar;
