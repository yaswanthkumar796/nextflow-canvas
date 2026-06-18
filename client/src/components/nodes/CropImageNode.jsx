import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useAuth } from '@clerk/clerk-react';
import useStore from '../../store';
import './nodes.css';

export default function CropImageNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const executeNode = useStore(state => state.executeNode);
  const isRunning = useStore(state => state.runningNodeIds.includes(id));
  const { getToken } = useAuth();

  const handleRun = async () => {
    const token = await getToken();
    executeNode(id, token);
  };
  
  return (
    <div className={`custom-node crop-image-node ${isRunning ? 'node-running' : ''}`}>
      <div className="node-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Crop Image</span>
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
      
      <div className="output-zone" style={{ padding: '0 12px 12px' }}>
        <div style={{ marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Generated Image</div>
          {!data.output ? (
            <div style={{ border: '1px solid #e5e7eb', padding: '16px', textAlign: 'center', color: '#9ca3af', borderRadius: '4px', fontSize: '12px' }}>
              No output yet
            </div>
          ) : (
            <img src={data.output} alt="Result" style={{ width: '100%', borderRadius: '4px', objectFit: 'contain' }} />
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output-image" />
    </div>
  );
}
