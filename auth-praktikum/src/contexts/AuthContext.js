import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged otomatis dipanggil saat:
    // - App pertama buka (cek apakah ada session)
    // - User login / logout
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        // Simpan ID token ke SecureStore (Keychain/Keystore, terenkripsi OS)
        const token = await u.getIdToken();
        await SecureStore.setItemAsync('auth_token', token);
      } else {
        // Hapus token saat logout
        await SecureStore.deleteItemAsync('auth_token');
      }

      setLoading(false);
    });

    return unsub; // cleanup listener saat komponen unmount
  }, []);

  const logout = async () => {
    await signOut(auth);
    await SecureStore.deleteItemAsync('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}