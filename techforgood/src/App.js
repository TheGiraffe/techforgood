import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/signup/SignupPage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/login/LoginPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path = 'login' element={<LoginPage />} />
        <Route path = 'signup' element={<SignupPage />} />
        <Route path = 'profile' element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
