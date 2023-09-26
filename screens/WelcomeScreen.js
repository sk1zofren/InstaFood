import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // Importez votre configuration Firebase ici

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifiez si un utilisateur est connecté
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // L'utilisateur est connecté, mettez à jour l'état de l'utilisateur
        setUser(authUser);
      } else {
        // Aucun utilisateur n'est connecté, l'état de l'utilisateur est nul
        setUser(null);
      }
    });

    // Nettoyez l'abonnement lors du démontage du composant
    return unsubscribe;
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Déconnexion de l'utilisateur
      navigation.navigate('Login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Si l'utilisateur est connecté, affichez la page de bienvenue
  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome, {user.email}!</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
          {/* Vous pouvez ajouter d'autres éléments ici */}
        </View>
      </SafeAreaView>
    );
  }

  // Si l'utilisateur n'est pas connecté, affichez un message d'erreur ou redirigez-le vers la page de connexion
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.errorMessage}>You are not logged in.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'yellow',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red', // Couleur du bouton de déconnexion
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20, // Espacement entre le bouton de déconnexion et le reste du contenu
  },
  logoutButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Couleur du texte du bouton de déconnexion
    textAlign: 'center',
  },
});
