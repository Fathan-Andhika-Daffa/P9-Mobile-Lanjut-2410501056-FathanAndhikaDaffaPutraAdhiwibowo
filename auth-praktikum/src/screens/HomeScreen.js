import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, logout, resetIdleTimer } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selamat datang, {user?.email}</Text>
      <Text style={styles.sub}>
        Auto-logout aktif: tidak ada aktivitas selama 30 detik akan logout otomatis.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          resetIdleTimer();
        }}
      >
        <Text style={styles.buttonText}>Lakukan Sesuatu</Text>
      </TouchableOpacity>

      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  sub: { fontSize: 12, color: 'gray', textAlign: 'center', marginBottom: 24 },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});