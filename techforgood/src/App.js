import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/firebase/AuthProvider';

import HomePage from './pages/home/HomePage';
import SignupPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/login/LoginPage';
import SearchPage from './pages/search/SearchPage';

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
    <div className="App">
      {profile ? (
        <TechForGoodNavbar
          accountType={profile.accountType}
          displayName={profile.firstName ? (profile.firstName + " " + (profile.lastName ? profile.lastName : "")) : (profile.organizationName ? profile.organizationName : "")}
        />
      ) : (
        <TechForGoodNavbar />
      )}

      <div style={{ marginTop: "4em" }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='signup' element={<SignupPage />} />
          <Route path='dashboard' element={<DashboardPage />} />
          <Route path='search' element={<SearchPage />} />
        </Routes>
        <img src={KSKaiauluLogo} width={"50%"} />
      </div>
    </div>
  );
}

export default App;

