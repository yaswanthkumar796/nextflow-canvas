import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  workflowId: null,
  runningNodeIds: [],

  setRunningNodes: (ids) => {
    set({ runningNodeIds: ids });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  removeEdge: (id) => {
    set({
      edges: get().edges.filter(e => e.id !== id)
    });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  loadWorkflow: async (id, token) => {
    try {
      const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
      const response = await fetch(`${API_URL}/api/workflows/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        let loadedNodes = data.nodes || [];
        if (loadedNodes.length === 0) {
          loadedNodes = [
            { id: 'request-inputs-node', type: 'requestInputs', position: { x: 100, y: 300 }, deletable: false, data: { fields: [] } },
            { id: 'response-node', type: 'responseNode', position: { x: 1000, y: 300 }, deletable: false, data: {} }
          ];
        }
        set({
          nodes: loadedNodes,
          edges: data.edges || [],
          workflowId: id
        });
      }
    } catch (error) {
    }
  },

  saveWorkflow: async (token) => {
    const { workflowId, nodes, edges } = get();
    if (!workflowId) return;

    try {
      const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
      await fetch(`${API_URL}/api/workflows/${workflowId}/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nodes, edges })
      });
    } catch (error) {
    }
  },

  executeNode: async (nodeId, token) => {
    const { workflowId, nodes, edges } = get();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !workflowId) return;

    // Dynamically resolve inputs across wired edges
    let resolvedData = { ...node.data };
    const incomingEdges = edges.filter(e => e.target === nodeId);
    
    incomingEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode && sourceNode.type === 'requestInputs') {
        const field = sourceNode.data.fields?.find(f => f.id === edge.sourceHandle);
        if (field) {
          if (edge.targetHandle === 'prompt') resolvedData.prompt = field.value;
          if (edge.targetHandle === 'system-prompt') resolvedData.systemPrompt = field.value;
          if (edge.targetHandle === 'image--vision-' || edge.targetHandle === 'input-image') resolvedData.imageUrl = field.value;
        }
      }
    });

    const payloadNode = { ...node, data: resolvedData };

    try {
      const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
      const response = await fetch(`${API_URL}/api/executions/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify([payloadNode])
      });
      if (!response.ok) {
        const err = await response.json();
        console.error("Execution failed:", err);
      } else {
        const result = await response.json();
        // Update the UI with the returned output!
        if (result.executions && result.executions.length > 0) {
          result.executions.forEach(exec => {
            set(state => ({
              nodes: state.nodes.map(n => 
                n.id === exec.nodeId ? { ...n, data: { ...n.data, output: exec.output } } : n
              )
            }));
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useStore;
