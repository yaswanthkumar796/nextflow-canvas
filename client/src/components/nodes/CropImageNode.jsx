import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import useStore from '../../store';
import './nodes.css';

export default function CropImageNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  
  return (
    <div className={`custom-node crop-image-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Crop Image</div>
      <Handle type="target" position={Position.Left} id="input-image" />
      <div className="node-content">
        <div className="input-group">
          <label>X Position (%)</label>
          <input 
            type="range" min="0" max="100" 
            className="node-range" 
            value={data.x ?? 0}
            onChange={(e) => updateNodeData(id, { x: parseInt(e.target.value) })}
          />
        </div>
        <div className="input-group">
          <label>Y Position (%)</label>
          <input 
            type="range" min="0" max="100" 
            className="node-range" 
            value={data.y ?? 0}
            onChange={(e) => updateNodeData(id, { y: parseInt(e.target.value) })}
          />
        </div>
        <div className="input-group">
          <label>Width (%)</label>
          <input 
            type="range" min="0" max="100" 
            className="node-range" 
            value={data.width ?? 100}
            onChange={(e) => updateNodeData(id, { width: parseInt(e.target.value) })}
          />
        </div>
        <div className="input-group">
          <label>Height (%)</label>
          <input 
            type="range" min="0" max="100" 
            className="node-range" 
            value={data.height ?? 100}
            onChange={(e) => updateNodeData(id, { height: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output-image" />
    </div>
  );
}
