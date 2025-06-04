import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import TaskPage from "@/pages/dashboard/TaskPage";
import CalendarPage from "@/pages/dashboard/CalendarPage";
import JournalPage from "@/pages/dashboard/JournalPage";
import TimerPage from "@/pages/dashboard/TimerPage";
import NotesPage from "@/pages/dashboard/NotesPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import AiChatPage from "@/pages/dashboard/AiChatPage";
import MindfulnessPage from "@/pages/dashboard/MindfulnessPage";
import AboutPage from "@/pages/AboutPage";
import SchoolPage from "@/pages/dashboard/SchoolPage"; 
import ResourcesPage from "@/pages/dashboard/ResourcesPage";
import FlashcardsPage from "@/pages/dashboard/FlashcardsPage";

import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />
          <Route path="/subscribe" element={<SubscriptionPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/tasks" element={<DashboardPage><TaskPage /></DashboardPage>} />
            <Route path="/dashboard/calendar" element={<DashboardPage><CalendarPage /></DashboardPage>} />
            <Route path="/dashboard/journal" element={<DashboardPage><JournalPage /></DashboardPage>} />
            <Route path="/dashboard/timer" element={<DashboardPage><TimerPage /></DashboardPage>} />
            <Route path="/dashboard/notes" element={<DashboardPage><NotesPage /></DashboardPage>} />
            <Route path="/dashboard/mindfulness" element={<DashboardPage><MindfulnessPage /></DashboardPage>} />
            <Route path="/dashboard/settings" element={<DashboardPage><SettingsPage /></DashboardPage>} />
            <Route path="/dashboard/ai-chat" element={<DashboardPage><AiChatPage /></DashboardPage>} /> 
            <Route path="/dashboard/school" element={<DashboardPage><SchoolPage /></DashboardPage>} />
            <Route path="/dashboard/resources" element={<DashboardPage><ResourcesPage /></DashboardPage>} />
            <Route path="/dashboard/flashcards" element={<DashboardPage><FlashcardsPage /></DashboardPage>} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;