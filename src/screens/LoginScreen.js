import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '../styles';
import { login } from '../lib/auth';
import { AuthContext } from '../../App';

export default function LoginScreen({ route, navigation }) {
  const selectedUserType = route.params?.selectedUserType;
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      // Optionally check role hint; we don't block login if it differs
      setUser(user);
      navigation.reset({ index: 0, routes: [{ name: 'Screen1' }] });
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.h1}>Sign in{selectedUserType ? ` as ${selectedUserType[0].toUpperCase()+selectedUserType.slice(1)}` : ''}</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <View style={styles.divider} />
        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry style={styles.input} value={password} onChangeText={setPassword} placeholder="password" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.row}>
          <Pressable disabled={loading} style={[styles.btn, styles.btnPrimary]} onPress={onSubmit}>
            <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <Pressable onPress={() => navigation.navigate('Register', { selectedUserType })}>
          <Text style={styles.link}>Create account</Text>
        </Pressable>
      </View>
    </View>
  );
}
