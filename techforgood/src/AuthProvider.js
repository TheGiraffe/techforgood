// Managing authentication state and providing the it to the rest of the application through a context
// currently using firebase auth to listen for auth state changes and update the user state accordingly
// fetches (gets) user profile data using getData function

import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getData from "./features/firebase/getData";

const AuthContext = createContext(); //store's the authentication state

export const useAuth = () => { //hook is used to provided to access the authentication state in other components
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        const {result, error} = getData('users', currentUser.uid);
        if (!error) {
          setProfile(result);
      }
      } else {
      setProfile(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);
  
  return (
    <AuthContext.Provider value={{ user, loading, profile}}> 
      {!loading && children}
    </AuthContext.Provider>
  );
};