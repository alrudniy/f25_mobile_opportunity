import React, { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../styles';
import { AuthContext } from '../../App';

function displayName(user) {
  const full = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return full || user.email;
}

export default function Screen1({ navigation }) {
  const { user } = useContext(AuthContext);
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.h1}>Hello {displayName(user)}</Text>
        <Text style={styles.p}>You are signed in as <Text style={{fontWeight:'700'}}>{user.user_type[0].toUpperCase()+user.user_type.slice(1)}</Text>.</Text>
        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={() => navigation.navigate('Screen2')}><Text style={styles.btnText}>Go to Screen 2</Text></Pressable>
          <Pressable style={styles.btn} onPress={() => navigation.navigate('Screen3')}><Text style={styles.btnText}>Go to Screen 3</Text></Pressable>
        </View>
      </View>
    </View>
  );
}
