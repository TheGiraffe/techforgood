import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/firebase/AuthProvider';
import SignupPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';

import LoginPage from './pages/login/LoginPage';
import SearchPage from './pages/search/SearchPage';

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
    <div className="App" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
        rel="stylesheet"
      />
      <div>
        <h1 style={{color: "#61ba88", fontSize: "8em"}}>Tech For Good</h1>
        <h3 style={{color: "#00522c"}}>Look for your next tech opportunity(?)</h3>
      </div>
      <div>
        <button onClick={() => { window.location.href = '/' }}>Home</button>
        {!user && (
          <button onClick={() => { window.location.href = '/signup' }}>Sign Up</button>
        )
        }
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={() => { window.location.href = '/login' }}>Login</button>
        )}
        {user && (
          <button onClick={() => { window.location.href = '/dashboard' }}>Dashboard</button>
        )}
        <button onClick={() => {window.location.href = '/search'}}>Search for work</button>
      </div>
      <Routes>
        <Route path='login' element={<LoginPage />} />
        <Route path='signup' element={<SignupPage />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='search' element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;

