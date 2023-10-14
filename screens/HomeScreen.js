import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';


const HomeScreen = () => {
  return (
    // image en arrière plan et le titre
    <ImageBackground source={require('../assets/back.jpg')} resizeMode="cover" style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.text}>InstaFood</Text>
       
      </View>
    </ImageBackground>
  );
};

// le style de mes compsants
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
});

export default HomeScreen;
