import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  // Navigation entre les différents écrans
  const navigation = useNavigation();

  // Initialisation des états pour les données utilisateur et les messages d'erreur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //Methode de la connexion de l'utilisateur
  const handleLogin = async () => {
    // Vérification des champs
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    try {
      
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection vers la page d'accueil si on est connecter
      navigation.navigate('Welcome');
    } catch (error) {
      // Gestion des erreurs de connexion
      setErrorMessage('Adresse e-mail ou mot de passe non valide.');
    }
  };

  return (
    // Affichage des champs de saisie et des boutons
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
      
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
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

// Styles des composants
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD9C0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerIcon: {
    backgroundColor: '#5A3511',
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
  input: {
    backgroundColor: '#D0C2A7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: 250,
  },
  loginButton: {
    backgroundColor: '#5A3511',
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
    color: '#5A3511',
    fontWeight: 'bold',
  },
  signupLinkText: {
    color: '#5A3511',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  orText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#5A3511',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  }
});
