import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sukses', 'Email reset password telah dikirim. Cek inbox kamu.');
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Masukkan email kamu"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Kirim Email Reset" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12,
  },
});