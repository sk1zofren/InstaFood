import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import { themeColors } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';


// Import Firebase
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const navigation = useNavigation();

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
  const handleLogin = async () => {
    try {
      
      await signInWithEmailAndPassword(auth,email, password)
     
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Login error :', error.message);
    
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.content}>
           
            <TextInput
                style={styles.input}
                placeholder='Adresse email'
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder='Mot de passe'
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>Ou</Text>
            <View style={styles.signupLink}>
                <Text style={styles.signupText}>Pas encore inscrit ?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLinkText}> Inscrivez-vous</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);
}

// ... le reste du code ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD9C0',  // Beige plus foncé
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerIcon: {
    backgroundColor: '#5A3511', // Marron plus foncé
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    backgroundColor: '#EAD9C0',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#D0C2A7', // Un ton légèrement plus foncé pour les entrées
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: 250,
  },
  loginButton: {
    backgroundColor: '#5A3511', // Marron plus foncé
    paddingVertical: 15,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#5A3511', // Marron plus foncé
    fontWeight: 'bold',
  },
  signupLinkText: {
    color: '#5A3511', // Marron plus foncé
    fontWeight: 'bold',
    marginLeft: 5,
  },
  orText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#5A3511', // Marron plus foncé
  }
});


