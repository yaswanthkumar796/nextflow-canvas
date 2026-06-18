import React, { useEffect, useState } from 'react';
import { UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const token = await getToken();
        const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
        const response = await fetch(`${API_URL}/api/workflows`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setWorkflows(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [getToken]);

  const handleCreateWorkflow = async () => {
    try {
      const token = await getToken();
      const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
      const response = await fetch(`${API_URL}/api/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id })
      });
      const newWorkflow = await response.json();
      if (newWorkflow && newWorkflow.id) {
        navigate('/canvas/' + newWorkflow.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">NextFlow</div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Workflows</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <h1>My Workflows</h1>
          <div className="header-actions">
            <button className="btn-primary" onClick={handleCreateWorkflow}>
              <PlusCircle size={18} />
              <span>Create New Workflow</span>
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <section className="content-area">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" size={32} />
            </div>
          ) : workflows.length === 0 ? (
            <div className="empty-state">
              <h2>No Workflows Yet</h2>
              <p>Create your first workflow to get started.</p>
              <button className="btn-primary" onClick={handleCreateWorkflow}>
                <PlusCircle size={18} />
                <span>Create Workflow</span>
              </button>
            </div>
          ) : (
            <div className="workflow-grid">
              {workflows.map(wf => (
                <div key={wf.id} className="workflow-card">
                  <h3>{wf.name}</h3>
                  <p>Status: {wf.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
