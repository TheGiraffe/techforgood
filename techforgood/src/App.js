import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import SignupPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RequestForm from './pages/request/RequestForm';
import LoginPage from './pages/login/LoginPage';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();

  return (
    <div className="App">
      <div>
        <h1>Tech For Good</h1>
        <h3>Look for your next tech opportunity(?)</h3>
      </div>
      <div>
        <button onClick={() => { window.location.href = '/' }}>Home</button>
        <button onClick={() => { window.location.href = '/signup' }}>Sign Up</button>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={() => { window.location.href = '/login' }}>Login</button>
        )}
        <button onClick={() => { window.location.href = '/dashboard' }}>Dashboard</button>
        <button onClick={() => { window.location.href = '/request' }}>Request</button>
      </div>
      <Routes>
        <Route path='login' element={<LoginPage />} />
        <Route path='signup' element={<SignupPage />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='request' element={<RequestForm />} />
      </Routes>
    </div>
  );
}

export default App;

