import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      Alert.alert('Login Gagal', e.message);
    }
  };

  const handleBiometric = async () => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (!token) {
      Alert.alert('Belum ada sesi', 'Login dulu dengan email & password.');
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Tidak tersedia', 'Perangkat tidak mendukung biometric.');
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert('Belum terdaftar', 'Daftarkan dulu Face ID / Fingerprint di pengaturan HP.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login dengan biometric',
      fallbackLabel: 'Gunakan password',
      cancelLabel: 'Batal',
    });

    if (result.success) {
      Alert.alert('Berhasil', 'Welcome back!');
    } else {
      Alert.alert('Gagal', 'Biometric tidak cocok, coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Login dengan Biometric" onPress={handleBiometric} />
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Belum punya akun? Daftar
      </Text>
      <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
        Lupa password?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12,
  },
  link: { marginTop: 12, color: 'blue', textAlign: 'center' },
});