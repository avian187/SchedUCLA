import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Home from "./routing/Home";
import About from "./routing/About";
import Contact from "./routing/Contact";
import Settings from "./routing/Settings";
import Login from "./routing/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetails from "./routing/EventDetails";

import SidePanel from "./components/SidePanel";
import "./style/Global.css";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <div className="flex">
        {/* ✅ Shared persistent sidebar */}
        <ProtectedRoute>
          <SidePanel />
        </ProtectedRoute>

        {/* Main content area */}
        <div className="flex-1 min-h-screen">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected pages */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About isDarkMode={isDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact isDarkMode={isDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings isDarkMode={isDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
