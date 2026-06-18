import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../../store';
import './nodes.css';

export default function ResponseNode({ id, data }) {
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  return (
    <div className={`custom-node response-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Response</div>
      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-content">
        <div className="response-bucket">
          Waiting for execution...
        </div>
      </div>
    </div>
  );
}
