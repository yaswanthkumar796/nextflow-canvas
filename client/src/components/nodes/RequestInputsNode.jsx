import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import useStore from '../../store';
import ImageUploadZone from '../ImageUploadZone';
import './nodes.css';

export default function RequestInputsNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  const fields = data.fields || [];

  const addField = (type) => {
    const newField = { id: `${type}-field_${Date.now()}`, type, label: type === 'text_field' ? 'Text Input' : 'Image Input', value: '' };
    updateNodeData(id, { fields: [...fields, newField] });
  };

  const updateField = (fieldId, newValue) => {
    const updatedFields = fields.map(f => f.id === fieldId ? { ...f, value: newValue } : f);
    updateNodeData(id, { fields: updatedFields });
  };

  return (
    <div className={`custom-node request-inputs-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Request Inputs</div>
      <div className="node-content">
        {fields.map((f, index) => (
          <div key={f.id} className="field-row">
            <label className="field-label">{f.label}</label>
            {f.type === 'text_field' ? (
              <textarea 
                placeholder="Enter text..." 
                className="node-textarea"
                value={f.value || ''}
                onChange={(e) => updateField(f.id, e.target.value)}
              />
            ) : (
              <ImageUploadZone 
                currentImage={f.value} 
                onUpload={(imgUrl) => updateField(f.id, imgUrl)} 
              />
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
