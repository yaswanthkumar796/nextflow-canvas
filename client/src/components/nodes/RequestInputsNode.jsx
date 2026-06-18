import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../../store';
import './nodes.css';

export default function RequestInputsNode({ id, data }) {
  const [fields, setFields] = useState(data.fields || []);
  const isRunning = useStore(state => state.runningNodeIds.includes(id));

  const addField = (type) => {
    const newField = { id: `${type}-field_${Date.now()}`, type, label: type === 'text_field' ? 'Text Input' : 'Image Input' };
    setFields([...fields, newField]);
  };

  return (
    <div className={`custom-node request-inputs-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Request Inputs</div>
      <div className="node-content">
        {fields.map((f, index) => (
          <div key={f.id} className="field-row">
            <label className="field-label">{f.label}</label>
            {f.type === 'text_field' ? (
              <textarea placeholder="Enter text..." className="node-textarea" />
            ) : (
              <div className="image-upload">Upload Image</div>
            )}
            <Handle 
              type="source" 
              position={Position.Right} 
              id={f.id} 
              style={{ top: '50%' }}
            />
          </div>
        ))}
        <div className="add-buttons">
          <button onClick={() => addField('text_field')}>+ Text</button>
          <button onClick={() => addField('image_field')}>+ Image</button>
        </div>
      </div>
    </div>
  );
}
