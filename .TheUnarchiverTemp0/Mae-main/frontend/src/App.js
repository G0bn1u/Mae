import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Punitions from "./pages/Punitions";
import Orgasmes from "./pages/Orgasmes";
import CarnetIntime from "./pages/CarnetIntime";
import Histoires from "./pages/Histoires";
import LiensUtiles from "./pages/LiensUtiles";
import Seances from "./pages/Seances";
import Inventaire from "./pages/Inventaire";
import Documents from "./pages/Documents";
import Idees from "./pages/Idees";
import De10 from "./pages/De10";
import Rituels from "./pages/Rituels";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/punitions" element={<ProtectedRoute><Punitions /></ProtectedRoute>} />
            <Route path="/orgasmes" element={<ProtectedRoute><Orgasmes /></ProtectedRoute>} />
            <Route path="/carnet" element={<ProtectedRoute><CarnetIntime /></ProtectedRoute>} />
            <Route path="/histoires" element={<ProtectedRoute><Histoires /></ProtectedRoute>} />
            <Route path="/liens" element={<ProtectedRoute><LiensUtiles /></ProtectedRoute>} />
            <Route path="/seances" element={<ProtectedRoute><Seances /></ProtectedRoute>} />
            <Route path="/inventaire" element={<ProtectedRoute><Inventaire /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/idees" element={<ProtectedRoute><Idees /></ProtectedRoute>} />
            <Route path="/de10" element={<ProtectedRoute><De10 /></ProtectedRoute>} />
            <Route path="/rituels" element={<ProtectedRoute><Rituels /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
