import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../styles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.h1}>Welcome</Text>
        <Text style={styles.p}>Please choose your user type to continue.</Text>
        <View style={styles.row}>
          {['student','organization','administrator'].map(role => (
            <Pressable
              key={role}
              style={({pressed}) => [styles.btn, pressed && {opacity:0.9}]}
              onPress={() => navigation.navigate('Login', { selectedUserType: role })}>
              <Text style={styles.btnText}>
                {role === 'student' ? 'I am a Student'
                  : role === 'organization' ? 'I am an Organization'
                  : 'I am an Administrator'}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.divider} />
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Create account</Text>
        </Pressable>
      </View>
    </View>
  );
}
