import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ImageBackground source={require('../assets/back.jpg')} resizeMode="cover" style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to MyApp</Text>
        {/* Vos autres composants */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: themeColors.primary,
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
