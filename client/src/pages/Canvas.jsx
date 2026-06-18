import React, { useEffect, useRef } from 'react';
import { ReactFlow, Background, MiniMap, Controls, getOutgoers } from '@xyflow/react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import useStore from '../store';
import RequestInputsNode from '../components/nodes/RequestInputsNode';
import CropImageNode from '../components/nodes/CropImageNode';
import GeminiProNode from '../components/nodes/GeminiProNode';
import ResponseNode from '../components/nodes/ResponseNode';
import ToolbarPicker from '../components/ToolbarPicker';
import HistoryPanel from '../components/HistoryPanel';
import DeletableEdge from '../components/DeletableEdge';
import '@xyflow/react/dist/style.css';
import './Canvas.css';

const nodeTypes = {
  requestInputs: RequestInputsNode,
  cropImage: CropImageNode,
  geminiPro: GeminiProNode,
  responseNode: ResponseNode,
};

const edgeTypes = {
  default: DeletableEdge
};

const Canvas = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    loadWorkflow,
    saveWorkflow,
    setRunningNodes,
    setNodes,
    setEdges
  } = useStore();
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAndLoad = async () => {
      const token = await getToken();
      if (id && token) {
        await loadWorkflow(id, token);
      }
    };
    fetchAndLoad();
  }, [id, getToken, loadWorkflow]);

  const handleSave = async () => {
    const token = await getToken();
    await saveWorkflow(token);
  };

  const isValidConnection = (connection) => {
    const target = nodes.find((node) => node.id === connection.target);
    const hasCycle = (node, visited = new Set()) => {
      if (visited.has(node.id)) return false;
      visited.add(node.id);
      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
      return false;
    };
    if (target && hasCycle(target)) return false;

    const sourceHandleType = connection.sourceHandle?.includes('image') ? 'image' : 'text';
    const targetHandleType = connection.targetHandle?.includes('image') ? 'image' : 'text';
    if (sourceHandleType !== targetHandleType) return false;

    return true;
  };

  const handleRun = async () => {
    const token = await getToken();
    const nodeIds = nodes.map(n => n.id);
    setRunningNodes(nodeIds);

    const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
    try {
      await fetch(`${API_URL}/api/executions/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nodes)
      });
    } catch (error) {
    } finally {
      setRunningNodes([]);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflow.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          if (content.nodes && content.edges) {
            setNodes(content.nodes);
            setEdges(content.edges);
          }
        } catch (error) {}
      };
      reader.readAsText(file);
    }
    event.target.value = null;
  };

  return (
    <div className="canvas-container">
      <header className="canvas-header">
        <h2>Workflow Editor</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <input type="file" accept=".json" style={{display: 'none'}} ref={fileInputRef} onChange={handleImport} />
          <button className="btn-primary" onClick={() => fileInputRef.current.click()}>Import JSON</button>
          <button className="btn-primary" onClick={handleExport}>Export JSON</button>
          <button className="btn-primary" onClick={handleRun}>Run Workflow</button>
          <button className="btn-primary" onClick={handleSave}>Save Workflow</button>
        </div>
      </header>
      <div className="react-flow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          isValidConnection={isValidConnection}
          fitView
        >
          <Background variant="dots" gap={12} size={1} color="#555" />
          <MiniMap nodeStrokeColor="#444" nodeColor="#222" maskColor="rgba(0,0,0,0.5)" />
          <Controls />
        </ReactFlow>
        <ToolbarPicker />
        <HistoryPanel />
      </div>
    </div>
  );
};

export default Canvas;
