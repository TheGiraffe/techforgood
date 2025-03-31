// Managing authentication state and providing the it to the rest of the application through a context
// currently using firebase auth to listen for auth state changes and update the user state accordingly
// fetches (gets) user profile data using getData function

import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDataById } from "./getData";

const AuthContext = createContext(); //store's the authentication state

export const useAuth = () => { //hook is used to provided to access the authentication state in other components
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        const { result, error } = await getDataById('users', currentUser.uid);
        if (!error) {
          setProfile(result);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setProfile(null);
      setLogoutMessage('You have been successfully signed out.');
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, profile, logout, logoutMessage }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};