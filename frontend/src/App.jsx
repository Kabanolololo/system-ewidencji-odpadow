import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

import Dashboard from './features/dashboard/components/Dashboard';
import Default from './features/dashboard/Default';
import AdminPanel from './features/dashboard/components/AdminPanel';
import Drivers from './features/dashboard/components/Drivers';
import Vehicles from './features/dashboard/components/Vehicles';
import Destinations from './features/dashboard/components/Destinations';
import Contractors from './features/dashboard/components/Contractors';
import Waste from './features/dashboard/components/Waste';
import Reports from './features/dashboard/Reports';
import Account from './features/dashboard/components/Account';
import LogOut from './features/dashboard/LogOut';
import Records from './features/dashboard/Records';
import Users from './features/dashboard/components/Users';
import AuditLog from './features/dashboard/components/AuditLog';

function App() {
  // domyślnie true, żeby symulować "zalogowanego" użytkownika
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <main>
        <Routes>
          {/* Jeśli nie jest zalogowany, pokazuj LoginForm */}
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <LoginForm onLogin={() => setIsLoggedIn(true)} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Chroniony dashboard */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            <Route index element={<Default />} />
            <Route path="admin" element={<AdminPanel />}>
              <Route path="users" element={<Users />} />
              <Route path="audit-log" element={<AuditLog />} />
            </Route>
            <Route path="drivers" element={<Drivers />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="contractors" element={<Contractors />} />
            <Route path="waste" element={<Waste />} />
            <Route path="records" element={<Records />} />
            <Route path="reports" element={<Reports />} />
            <Route path="account" element={<Account />} />
            <Route path="logout" element={<LogOut />} />
          </Route>

          {/* Wszystko inne na login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;