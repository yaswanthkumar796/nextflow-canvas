import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import useStore from '../store';
import './ToolbarPicker.css';

const ToolbarPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Others');
  const addNode = useStore((state) => state.addNode);

  const categories = ['Recent', 'Image', 'Video', 'Audio', 'Others'];

  const items = {
    Image: [{ label: 'Crop Image', type: 'cropImage' }],
    Others: [{ label: 'Gemini 3.1 Pro', type: 'geminiPro' }]
  };

  const handleSelect = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 200 + 300, y: Math.random() * 200 + 300 },
      data: { fields: [] },
    };
    addNode(newNode);
    setIsOpen(false);
  };

  return (
    <div className="toolbar-container">
      {isOpen && (
        <div className="picker-modal">
          <div className="picker-sidebar">
            {categories.map(cat => (
              <div 
                key={cat} 
                className={`picker-category ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
          <div className="picker-content">
            <input type="text" className="picker-search" placeholder="Search..." />
            <div className="picker-items">
              {(items[activeCategory] || []).map(item => (
                <div 
                  key={item.label} 
                  className="picker-item"
                  onClick={() => handleSelect(item.type)}
                >
                  {item.label}
                </div>
              ))}
              {(!items[activeCategory] || items[activeCategory].length === 0) && (
                <div className="picker-empty">No items found</div>
              )}
            </div>
          </div>
        </div>
      )}
      <button className="toolbar-btn" onClick={() => setIsOpen(!isOpen)}>
        <Plus size={24} />
      </button>
    </div>
  );
};

export default ToolbarPicker;
