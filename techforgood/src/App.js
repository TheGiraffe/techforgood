
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/signup/SignupPage';
import ProfilePage from './pages/profile/ProfilePage';
import RequestDetailPage from './pages/request/RequestDetailPage';
import LoginPage from './pages/login/LoginPage';

function App() {
  return (
    <div className="App">
      <div>
        <h1>Tech For Good</h1>
        <h3>Look for your next tech opportunity(?)</h3>
      </div>
      <div>
        <button onClick={() => { window.location.href = '/' }}>Home</button>
        <button onClick={() => { window.location.href = '/signup' }}>Sign Up</button>
        <button onClick={() => { window.location.href = '/login' }}>Login</button>
        <button onClick={() => { window.location.href = '/profile' }}>Profile</button>
        <button onClick={() => { window.location.href = '/request' }}>Request</button>  
      </div>
      <Routes>
        <Route path = 'login' element={<LoginPage />} />
        <Route path = 'signup' element={<SignupPage />} />
        <Route path = 'profile' element={<ProfilePage />} />
        <Route path = 'request' element={<RequestDetailPage />} />
      </Routes>
    </div>
  );
} 

export default App;

