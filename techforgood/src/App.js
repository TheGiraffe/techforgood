import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/firebase/AuthProvider';

import HomePage from './pages/home/HomePage';
import SignupPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/login/LoginPage';
import SearchPage from './pages/search/SearchPage';
import SearchRequestExpanded from './pages/search/SearchRequestExpanded';

import 'bootstrap/dist/css/bootstrap.css';
import KSKaiauluLogo from "./assets/KS-Kaiaulu-Horizontal-Logo.png"
import TechForGoodNavbar from './components/TechForGoodNavbar';
import { useState, useEffect } from 'react';
import getUserProfile from './features/firebase/auth/getUserProfile';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});


  const getProfileDetails = async () => {
    const profileDetails = await getUserProfile()
    if (profileDetails) {
      setProfile(profileDetails);
    }
  }

  useEffect(() => {
    getProfileDetails();
  }, [user])

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
        <button onClick={() => {navigate('/')}}>Home</button>
        {!user && (
          <button onClick={() => {navigate('/signup')}}>Sign Up</button>
        )
        }
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={() => {navigate('/login')}}>Login</button>
        )}
        {user && (
          <button onClick={() => {navigate('/dashboard')}}>Dashboard</button>
        )}
        <button onClick={() => {navigate('/search')}}>Search for work</button>
      </div>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/search/expanded/:id' element={<SearchRequestExpanded />} />
      </Routes>
    </div>
  );
}

export default App;

