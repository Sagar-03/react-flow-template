import React, { useState } from 'react';
import './Menunode.css';
import './MenuNodeSidebar.css';

export default function MenuNodeSidebar({
  items = [],
  setItems,
  onClose,
  isOpen, // receive open state
  initialInputType = 'message',
  initialMatchType = 'exact',
  initialReply = ''
}) {
  const [newItem, setNewItem] = useState('');
  const [inputType, setInputType] = useState(initialInputType);
  const [replyFromUser, setReplyFromUser] = useState(initialReply);
  const [matchType, setMatchType] = useState(initialMatchType);

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onClose?.();
  };

  return (
    <aside
      className={`sidebar-panel ${isOpen ? 'open' : ''}`}
      role="complementary"
      aria-label="Configuration panel"
    >
      <div className="sidebar-header">
        <h2>Configuration</h2>
        <button onClick={onClose} className="close-btn" aria-label="Close configuration">×</button>
      </div>

      <div className="sidebar-body config-body">
        <label className="config-label">Please select input type <span className="req">*</span></label>
        <select
          className="config-select"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="message">Message</option>
          <option value="button">Button</option>
          <option value="payload">Payload</option>
        </select>

        <label className="config-label">Reply From User <span className="req">*</span></label>
        <input
          className="config-input"
          placeholder="support"
          value={replyFromUser}
          onChange={(e) => setReplyFromUser(e.target.value)}
        />

        <label className="config-label">Select match type <span className="req">*</span></label>
        <select
          className="config-select"
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
        >
          <option value="exact">Exact match</option>
          <option value="contains">Contains</option>
          <option value="regex">Regex</option>
        </select>

        <hr />

        <h4>Menu items</h4>
        <ul className="item-list">
          {items.map((item, idx) => (
            <li key={idx} className="item-row">
              <span>{item}</span>
              <button
                className="delete-btn"
                onClick={() => deleteItem(idx)}
                aria-label={`Delete ${item}`}
                title="Delete"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>

        <div className="input-row">
          <input
            className="config-input"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="New item name"
          />
          <button className="add-btn" onClick={addItem}>Add</button>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </aside>
  );
}
