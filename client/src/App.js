import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login'; // You'll need this for the "Already have an account? Login" link

// You can remove all the AuthContext, AuthProvider, PrivateRoute stuff for now
// and re-introduce it when you're ready for the full authentication flow.

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> Placeholder for your login component
          <Route path="*" element={<Navigate to="/register" replace />} /> {/* Default to register for now */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;