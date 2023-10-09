import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RechercheScreen from "./screens/RechercheScreen";
import PostScreen from "./screens/PostScreen";
import CreateRecetteScreen from "./screens/CreateRecetteScreen";
import MyRecetteScreen from "./screens/MyRecetteScreen";
import { auth } from './firebase';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
function MainTabs() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
      
      {user ? (
        <>
          <Tab.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Recherche"
            component={RechercheScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bookmark-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Post"
            component={PostScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-add-circle" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="CreateRecette"
            component={CreateRecetteScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyRecette"
            component={MyRecetteScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-person" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Login"
            component={LoginScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-log-in" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-person-add" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [listenerSet, setListenerSet] = useState(false);


  async function getRandomRecipe() {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.meals[0]; // Retournez la première (et unique) recette aléatoire obtenue
    } catch (error) {
        console.error("Erreur lors de la récupération d'une recette aléatoire:", error);
        return null;
    }
}


  // Configuration des écouteurs
  useEffect(() => {
    if (!listenerSet) {
      console.log('Setting up the notification listener...');

      Notifications.addNotificationReceivedListener(notification => {
        console.log('Une nouvelle notification a été reçue !');
      });

      Notifications.addNotificationResponseReceivedListener(async (response) => {
        console.log('Notification interaction:', response);
        
        // Obtenez une recette aléatoire
        const randomRecipe = await getRandomRecipe();
        
        if(randomRecipe && randomRecipe.idMeal) {
            // Naviguez vers l'écran de recette avec l'ID de recette comme paramètre
            navigate('Recherche', { recipe: randomRecipe });
        } else {
            console.error("Impossible d'obtenir une recette aléatoire");
        }
    });
    
    
    

      setListenerSet(true);
    }
  }, [listenerSet]);

  // Demande de permission et planification de la notification
  useEffect(() => {
    async function registerForNotifications() {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('Notification permissions not granted.');
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        
        const randomRecipe = await getRandomRecipe();
        // Planification de la notification
        if (randomRecipe && randomRecipe.strMeal) {
          await Notifications.scheduleNotificationAsync({
              content: {
                  title: "Recette du jour 🍽️",
                  body: `A table !!!`,
                  data: { test: "data" }
              },
              trigger: { seconds: 10000 }
        });
      }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    }

    registerForNotifications();

    // Gestionnaire de notifications en arrière-plan
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);



  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator mode="modal" headerMode="none">
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="postModal" component={PostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}