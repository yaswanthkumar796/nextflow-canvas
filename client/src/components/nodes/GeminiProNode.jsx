import React from 'react';
import { Handle, Position, useHandleConnections } from '@xyflow/react';
import useStore from '../../store';
import './nodes.css';

export default function GeminiProNode({ id, data }) {
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  const handles = ['Prompt', 'System Prompt', 'Image (Vision)', 'Video', 'Audio', 'File'];
  
  const sizeConnections = useHandleConnections({ type: 'target', id: 'size-input' });
  const isSizeConnected = sizeConnections.length > 0;

  return (
    <div className={`custom-node gemini-pro-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header">Gemini 3.1 Pro</div>
      <div className="node-content">
        <select className="node-select">
          <option>gemini-3.1-pro</option>
          <option>gemini-3.1-flash</option>
        </select>
        
        <div className="input-group" style={{ marginTop: '12px', marginBottom: '8px', position: 'relative' }}>
          <Handle 
            type="target" 
            position={Position.Left} 
            id="size-input" 
            style={{ top: '15px' }} 
          />
          <label style={{ display: 'block', marginBottom: '4px', marginLeft: '10px' }}>Size</label>
          
          {isSizeConnected ? (
            <div style={{ marginLeft: '10px' }}>
              <input type="text" className="node-select" value="Custom" readOnly style={{ width: '100%', boxSizing: 'border-box' }} />
              <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '6px', lineHeight: '1.3' }}>
                Upstream value isn't a preset — switched to Custom. Wire Width / Height ports for explicit values.
              </div>
              <div className="handles-container" style={{ marginTop: '8px' }}>
                <div className="handle-row">
                  <Handle 
                    type="target" 
                    position={Position.Left} 
                    id="width-input" 
                    style={{ top: '50%', backgroundColor: '#ec4899', borderColor: '#ec4899' }} 
                  />
                  <span className="handle-label">Width (1024-3840)</span>
                </div>
                <div className="handle-row">
                  <Handle 
                    type="target" 
                    position={Position.Left} 
                    id="height-input" 
                    style={{ top: '50%', backgroundColor: '#ec4899', borderColor: '#ec4899' }} 
                  />
                  <span className="handle-label">Height (1024-3840)</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginLeft: '10px' }}>
              <select className="node-select" style={{ width: '100%' }}>
                <option>1024x1024</option>
                <option>1920x1080</option>
                <option>1080x1920</option>
              </select>
            </div>
          )}
        </div>

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
