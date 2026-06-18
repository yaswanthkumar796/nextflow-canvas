import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../../store';
import './nodes.css';

export default function CropImageNode({ id, data }) {
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  return (
    <div className={`custom-node crop-image-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Crop Image</div>
      <Handle type="target" position={Position.Left} id="input-image" />
      <div className="node-content">
        <div className="input-group">
          <label>X Position (%)</label>
          <input type="range" min="0" max="100" defaultValue="0" className="node-range" />
        </div>
        <div className="input-group">
          <label>Y Position (%)</label>
          <input type="range" min="0" max="100" defaultValue="0" className="node-range" />
        </div>
        <div className="input-group">
          <label>Width (%)</label>
          <input type="range" min="0" max="100" defaultValue="100" className="node-range" />
        </div>
        <div className="input-group">
          <label>Height (%)</label>
          <input type="range" min="0" max="100" defaultValue="100" className="node-range" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output-image" />
    </div>
  );
}
