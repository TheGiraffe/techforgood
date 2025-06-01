import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/firebase/AuthProvider';

import HomePage from './pages/home/HomePage';
import SignupPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LoginPage from './pages/login/LoginPage';
import SearchPage from './pages/search/SearchPage';
import SearchRequestExpanded from './pages/search/SearchRequestExpanded';

import RequestsBids from './pages/request/RequestsBids';
import RequestsBidsExpanded from './pages/request/RequestsBidsExpanded';

import 'bootstrap/dist/css/bootstrap.css';
import TechForGoodNavbar from './components/TechForGoodNavbar';
import { useState, useEffect } from 'react';
import getUserProfile from './features/firebase/auth/getUserProfile';
import NewBidPage from './pages/bids/NewBidPage';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
      {profile ? (
        <TechForGoodNavbar
          accountType={profile.accountType}
          displayName={profile.firstName ? (profile.firstName + " " + (profile.lastName ? profile.lastName : "")) : (profile.organizationName ? profile.organizationName : "")}
        />
      ) : (
        <TechForGoodNavbar />
      )}
      {/* <div >
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
      </div> */}
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/search/expanded/:id' element={<SearchRequestExpanded />} />
          <Route path='/bids/new/' element={<NewBidPage />} />
          {/* for requests routing and bid routing */}
          <Route path='/requests/:requestId/bids' element={<RequestsBids />} />
          <Route path='/requests/:requestId/bids/:bidId' element={<RequestsBidsExpanded />} />
        </Routes>
      </div>
      <img src="https://github.com/TheGiraffe/techforgood/blob/main/assets/KS-Kaiaulu-Horizontal-Logo.png?raw=true" width={"50%"} />
    </div>
  );
}

export default App;

