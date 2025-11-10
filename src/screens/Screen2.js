import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../styles';

export default function Screen2({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.h1}>Screen 2</Text>
        <Text style={styles.p}>This is a placeholder page you can expand later.</Text>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Screen1')}>
          <Text style={styles.btnText}>← Back to Screen 1</Text>
        </Pressable>
      </View>
    </View>
  );
}
