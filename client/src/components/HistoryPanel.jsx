import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import './HistoryPanel.css';

export default function HistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        try {
          const token = await getToken();
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_URL}/api/workflows/history/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (Array.isArray(data)) setHistory(data);
        } catch (error) {
        }
      };
      fetchHistory();
    }
  }, [isOpen, getToken]);

  return (
    <div className={`history-panel ${isOpen ? 'open' : ''}`}>
      <button className="history-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close History' : 'View History'}
      </button>
      
      {isOpen && (
        <div className="history-content">
          <h3>Run History</h3>
          <div className="history-list">
            {history.map(run => (
              <div key={run.id} className="history-item">
                <div 
                  className="history-header"
                  onClick={() => setExpandedId(expandedId === run.id ? null : run.id)}
                >
                  <span className={`status-badge ${run.status || 'unknown'}`} />
                  <span className="history-time">{new Date(run.started_at).toLocaleString()}</span>
                  <span className="history-scope">{run.mode || 'Full'}</span>
                </div>
                {expandedId === run.id && (
                  <div className="history-details">
                    <pre>{JSON.stringify(run.execution_data, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
            {history.length === 0 && <div className="empty-history">No history found.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
