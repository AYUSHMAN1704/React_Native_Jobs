import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});
const API_URL = 'http://10.0.2.2:3000';

export { API_URL };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const response = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSession(data.user);
          } else {
            await SecureStore.deleteItemAsync('userToken');
            setSession(null);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitialized(true);
      }
    };
    loadSession();
  }, []);

  const signIn = async (user, token) => {
    await SecureStore.setItemAsync('userToken', token);
    setSession(user);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setSession(null);
  };

  const updateSession = (updatedUser) => {
    setSession(updatedUser);
  };

  const getToken = async () => {
    return await SecureStore.getItemAsync('userToken');
  };

  return (
    <AuthContext.Provider value={{ session, initialized, signIn, signOut, updateSession, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
