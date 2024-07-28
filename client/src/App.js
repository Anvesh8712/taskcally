import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import SignIn from "./components/Signin";
import SignUp from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AITodo from "./components/AITodo";
import { useAuth, AuthProvider } from "./AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
}

function unProtectedRoute({ children }) {
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route
              path="/signin"
              element={
                <unProtectedRoute>
                  <SignIn />
                </unProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <unProtectedRoute>
                  <SignUp />
                </unProtectedRoute>
              }
            />
            <Route path="/" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-todo"
              element={
                <ProtectedRoute>
                  <AITodo />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
