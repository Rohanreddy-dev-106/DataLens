import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import LandingPage from "./pages/LandingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DeepAnalyticPage from "./pages/DeepAnalyticPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/profile", {
        withCredentials: true,
      });
      if (response.data && response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {//it chicks on first  render 
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/user/logout", {}, {
        withCredentials: true,
      });
      setUser(null);
      alert("Logout successful!");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route
          path='/'
          element={<LandingPage user={user} onLogout={handleLogout} />}
        />

        {/* Login Page: If logged in, redirect to analytics */}
        <Route
          path='/login'
          element={
            user ? (
              <Navigate to='/analytics' replace />
            ) : (
              <LoginForm onLoginSuccess={checkAuth} />
            )
          }
        />

        {/* Register Page: If logged in, redirect to analytics */}
        <Route
          path='/register'
          element={
            user ? <Navigate to='/analytics' replace /> : <RegisterForm />
          }
        />
        <Route path='/signup' element={<Navigate to='/register' replace />} />

        {/* Analytics Workspace: If not logged in, redirect to login */}
        <Route
          path='/analytics'
          element={
            user ? (
              <AnalyticsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/analytics/deep'
          element={
            user ? (
              <DeepAnalyticPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />

        {/* Catch-all redirects to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
