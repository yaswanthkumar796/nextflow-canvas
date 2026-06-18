import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useStore from '../../store';
import './nodes.css';

export default function GeminiProNode({ id, data }) {
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  const handles = ['Prompt', 'System Prompt', 'Image (Vision)', 'Video', 'Audio', 'File'];
  
  return (
    <div className={`custom-node gemini-pro-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Gemini 3.1 Pro</div>
      <div className="node-content">
        <select className="node-select">
          <option>gemini-3.1-pro</option>
          <option>gemini-3.1-flash</option>
        </select>
        
        <div className="handles-container">
          {handles.map((h, i) => (
            <div key={h} className="handle-row">
              <Handle 
                type="target" 
                position={Position.Left} 
                id={h.toLowerCase().replace(/[^a-z0-9]/g, '-')} 
                style={{ top: '50%' }}
              />
              <span className="handle-label">{h}</span>
            </div>
          ))}
        </div>
        
        <div className="response-block">
          Output will appear here...
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}
