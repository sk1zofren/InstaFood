import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import { themeColors } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';


// Import Firebase
import { auth } from '../firebase';

export default function SignUpScreen() {
  const navigation = useNavigation();

  // États pour les champs du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      // Créer un nouvel utilisateur avec l'email et le mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Récupérer l'utilisateur créé
      const user = userCredential.user;
      console.log('User signed up:', user.email);
  
      // Rediriger l'utilisateur vers la page de connexion après inscription réussie
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Sign up error:', error.message);
      // Afficher une erreur à l'utilisateur, par exemple en utilisant une alerte
      // ou en affichant un message d'erreur à l'écran
    }
  };
  

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerIcon}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View
        style={styles.content}
      >
        <View style={styles.form}>
         
          <TextInput
            style={styles.input}
            placeholder='Full Name'
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Email Address'
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Password'
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            color="purple"
          />
        </View>
        <Text style={styles.orText}>Or</Text>
      
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerIcon: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    backgroundColor: 'lightgray',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: themeColors.primary,
    paddingVertical: 15,
    borderRadius: 10,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  loginLinkText: {
    color: themeColors.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
