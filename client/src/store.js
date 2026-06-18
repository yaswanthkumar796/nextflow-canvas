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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
  }
}));

export default useStore;
