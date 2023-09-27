import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MessageScreen from "./screens/MessageScreen";
import PostScreen from "./screens/PostScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { auth } from './firebase';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
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

  return (
    <NavigationContainer>
      <Tab.Navigator>
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
              name="Message"
              component={MessageScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="ios-chatboxes" size={size} color={color} />
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
              name="Notification"
              component={NotificationScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="ios-notifications" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
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
    </NavigationContainer>
  );
}
