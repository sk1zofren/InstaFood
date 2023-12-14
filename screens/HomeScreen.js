import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

// Composant de l'écran d'accueil
const HomeScreen = () => {
  return (
    // Utilisation d'une image en arrière-plan 
    <ImageBackground 
      source={require('../assets/back.jpg')} 
      resizeMode="cover" 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.text}>InstaFood</Text>
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
  // Style du texte (titre)
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  // Style de l'image d'arrière-plan
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
