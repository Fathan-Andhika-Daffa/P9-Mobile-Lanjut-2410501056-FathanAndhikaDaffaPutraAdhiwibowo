import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const IDLE_TIMEOUT = 30 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const idleTimer = useRef(null);
  const appState = useRef(AppState.currentState);

  const logout = async () => {
    clearTimeout(idleTimer.current);
    await signOut(auth);
    await SecureStore.deleteItemAsync('auth_token');
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        resetIdleTimer();
      }

      if (nextState.match(/inactive|background/)) {
        resetIdleTimer();
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const token = await u.getIdToken();
        await SecureStore.setItemAsync('auth_token', token);
        resetIdleTimer();
      } else {
        await SecureStore.deleteItemAsync('auth_token');
        clearTimeout(idleTimer.current);
      }

      setLoading(false);
    });

    return () => {
      unsub();
      clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, resetIdleTimer }}>
      {children}
    </AuthContext.Provider>
  );
}