import React, { useState } from "react"; // Import useState
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BudgetPlanner from "./pages/BudgetPlanner";
import Chatbot from "./components/chatbot/Chatbot";
import ChatbotToggle from "./components/chatbot/ChatbotToggle";

function App() {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  // NEW: Add state for language management
  const [language, setLanguage] = useState("en-US"); // Default to English (US)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Pass language state and setter to Navbar */}
      {user && <Navbar language={language} setLanguage={setLanguage} />}

      <main className={user ? "container mx-auto p-4 md:p-6" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Pass language state to Dashboard for voice input */}
            <Route path="/" element={<Dashboard language={language} />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/planner" element={<BudgetPlanner />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>

      {user && (
        <>
          <ChatbotToggle onClick={() => setIsChatOpen(!isChatOpen)} />
          {/* Pass language state to Chatbot */}
          <Chatbot
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            language={language}
          />
        </>
      )}
    </div>
  );
}

export default App;
