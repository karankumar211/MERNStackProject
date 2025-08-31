// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from './pages/ProductsPage';
import Chatbot from './components/Chatbot';
import PickupPage from './pages/PickupPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} /> 
             <Route path="/admin" element={<AdminPage />} />
            <Route path="/request-pickup" element={<PickupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
         <Chatbot />
      </div>
    </Router>
  );
}

export default App;
