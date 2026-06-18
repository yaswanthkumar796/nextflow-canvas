import React from 'react';
import { Handle, Position, useNodeConnections, useReactFlow } from '@xyflow/react';
import { useAuth } from '@clerk/clerk-react';
import useStore from '../../store';
import './nodes.css';

export default function GeminiProNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const executeNode = useStore(state => state.executeNode);
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  const { getToken } = useAuth();
  const handles = ['Prompt', 'System Prompt', 'Image (Vision)', 'Video', 'Audio', 'File'];
  
  const sizeConnections = useNodeConnections({ handleType: 'target', handleId: 'size-input' });
  const isSizeConnected = sizeConnections.length > 0;

  const handleRun = async () => {
    const token = await getToken();
    executeNode(id, token);
  };

  return (
    <div className={`custom-node gemini-pro-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Gemini 3.1 Pro</span>
        <button 
          onClick={handleRun}
          style={{
            backgroundColor: '#e6f4ea', color: '#137333', border: 'none', borderRadius: '4px',
            padding: '2px 8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
          }}
        >
          <span>▶</span> Run
        </button>
      </div>
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
        
        <div className="output-zone" style={{ marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Response</div>
          {!data.output ? (
            <div style={{ border: '1px solid #e5e7eb', padding: '16px', textAlign: 'center', color: '#9ca3af', borderRadius: '4px', fontSize: '12px' }}>
              No output yet
            </div>
          ) : typeof data.output === 'string' && data.output.startsWith('http') ? (
            <img src={data.output} alt="Result" style={{ width: '100%', borderRadius: '4px', objectFit: 'contain' }} />
          ) : (
            <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '12px', color: '#374151', padding: '8px', background: '#f9fafb', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              {data.output}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}
