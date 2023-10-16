import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import defaultAvatar from '../assets/avata.png';





import { auth, db } from '../firebase';
import fireInstance from '../Fire'; 

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState(null);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicUri, setProfilePicUri] = useState(null);

    const pickImage = async () => {
      try {
          let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.5,
          });
  
          if (!result.cancelled) {
              setProfilePicUri(result.uri);
          }
      } catch (error) {
          console.log("Error @pickImage: ", error);
      }
  };

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status;
};

const addProfilePhoto = async () => {
  const status = await getPermission();

  if (status !== "granted") {
      alert("We need permission to access your camera roll.");
      return;
  }

  pickImage();
};
 
const handleSignUp = async () => {
  if (fullName.trim() === '' || email.trim() === '' || password.trim() === '') {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
  }

  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);

      let profilePicURL = null;
      if (profilePicUri) {
          profilePicURL = await fireInstance.uploadPhotoAsync(profilePicUri);
      }

      await setDoc(userDocRef, {
          fullName: fullName,
          email: email,
          ...(profilePicURL ? { profilePic: profilePicURL } : {}),
      });

      console.log('User signed up:', user.email);
      navigation.navigate('Welcome', { userName: fullName });
  } catch (error) {
      setErrorMessage('Adresse e-mail ou mot de passe non valide.');
  }
};

  return (
    <View style={styles.container}>
      
      <TouchableOpacity 
          style={styles.imagePlaceholderContainer}
          onPress={addProfilePhoto}>
          {profilePicUri ? (
            <Image source={{ uri: profilePicUri }} style={styles.profileImage} />
          ) : (
            <Image source={defaultAvatar} style={styles.profileImage} />
          )}
        </TouchableOpacity>
        <SafeAreaView style={styles.header}>
      
      <View style={styles.content}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder='Pseudo'
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Addresse email'
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Mot de passe'
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{errorMessage}</Text>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>Ou</Text>
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Vous avez déja un compte?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Connectez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAD9C0',  
  },
   imagePlaceholderContainer: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#5A3511',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#DDC3A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#5A3511',
    paddingVertical: 10,
    borderRadius: 8,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: '#5A3511',
    paddingVertical: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#EAD9C0',
  },
  headerIcon: {
    backgroundColor: '#5A3511',  // Marron plus foncé
    padding: 10,
    borderRadius: 20,
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
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#D0C2A7',  // Beige légèrement plus foncé pour les inputs
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#5A3511',  // Marron plus foncé
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#5A3511',  // Marron plus foncé
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#5A3511',  // Marron plus foncé
    fontWeight: 'bold',
  },
  loginLinkText: {
    color: '#5A3511',  // Marron plus foncé
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
