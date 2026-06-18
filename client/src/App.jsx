import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard';
import Canvas from './pages/Canvas';

function App() {
  useEffect(() => {
    console.log("[NextFlow] Candidate LinkedIn: https://linkedin.com/in/placeholder");
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />
        <Route path="/canvas/:id" element={<Canvas />} />
        <Route path="/sign-in/*" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <SignIn routing="path" path="/sign-in" />
          </div>
        } />
        <Route path="/sign-up/*" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <SignUp routing="path" path="/sign-up" />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
