import React, { useEffect, useState } from 'react';
import { View, Text, focused,TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
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
import { LogBox } from 'react-native';
import * as ExpoConstants from 'expo-constants';




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = React.createRef();

const PROJECT_ID = ExpoConstants?.manifest?.extra?.eas?.projectId;


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
    <Tab.Navigator 
    screenOptions={{headerShown:false}}>
      
      {user ? (
        <>
          <Tab.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="people" size={size} color={focused ? '#5A3511' : 'gray'} />
              ),
            }}
          />
          <Tab.Screen
           name="Recherche"
            component={RechercheScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="search" size={size} color={focused ? '#5A3511' : 'gray'} />
            ),
            }}
          />
          <Tab.Screen
           name="u"
            component={PostScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="send" size={size} color={focused ? '#5A3511' : 'gray'} />
            ),
            }}
          />
          <Tab.Screen
name="y"
            component={CreateRecetteScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="add" size={size} color={focused ? '#5A3511' : 'gray'} />
            ),
            }}
          />
          <Tab.Screen
           name="t"
            component={MyRecetteScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="pizza" size={size} color={focused ? '#5A3511' : 'gray'} />
            ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
             name="r"
            component={HomeScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="home" size={size} color={focused ? '#5A3511' : 'gray'} />
            ),
            
            }}
          />
          <Tab.Screen
           name="a"
            component={LoginScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="log-in" size={size} color={focused ? '#5A3511' : 'gray'} />
            ),
            }}
          />
          <Tab.Screen
           name="e"
            component={SignUpScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ focused, size }) => (
                <Ionicons name="person-add" size={size} color={focused ? '#5A3511' : 'gray'} />
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

  LogBox.ignoreAllLogs();
  async function getRandomRecipe() {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.meals[0]; 
    } catch (error) {
        
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
        
       
        const randomRecipe = await getRandomRecipe();
        
        if(randomRecipe && randomRecipe.idMeal) {
            
            navigate('Recherche', { recipe: randomRecipe });
        } else {
           
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

        const token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;

        
        const randomRecipe = await getRandomRecipe();

        const currentDate = new Date();


const hours = 12; 
const minutes = 30; 


const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes);


if (currentDate > targetDate) {
  targetDate.setDate(targetDate.getDate() + 1);
}


const timeUntilNotification = targetDate.getTime() - currentDate.getTime();

       
        if (randomRecipe && randomRecipe.strMeal) {
          await Notifications.scheduleNotificationAsync({
              content: {
                  title: "Recette du jour 🍽️",
                  body: `Devine le plat du jour r`,
                  data: { test: "data" }
              },
              trigger: { seconds: timeUntilNotification / 1000 }
        });
      }
      } catch (error) {
       
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
      <Stack.Navigator mode="modal" headerMode="none" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="postModal" component={PostScreen} />
</Stack.Navigator>

    </NavigationContainer>
  );
}