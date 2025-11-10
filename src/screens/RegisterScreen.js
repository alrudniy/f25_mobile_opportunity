import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { styles } from '../styles';
import { register } from '../lib/auth';
import { AuthContext } from '../../App';

const ROLES = ['student', 'organization', 'administrator'];

export default function RegisterScreen({ route, navigation }) {
  const hint = route.params?.selectedUserType;
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState(hint || 'student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      const user = await register(email.trim(), password, role);
      setUser(user);
      navigation.reset({ index: 0, routes: [{ name: 'Screen1' }] });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.h1}>Create Account</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />

        <View style={styles.divider} />
        <Text style={styles.label}>User type</Text>
        <View style={styles.radioRow}>
          {ROLES.map(r => {
            const selected = r === role;
            return (
              <Pressable key={r} style={[styles.radio, selected && styles.radioSelected]} onPress={() => setRole(r)}>
                <Text style={{fontWeight:selected?'700':'500'}}>{r[0].toUpperCase()+r.slice(1)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />
        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        <View style={styles.divider} />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.row}>
          <Pressable disabled={loading} style={[styles.btn, styles.btnPrimary]} onPress={onSubmit}>
            <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create Account'}</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Back to sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}
