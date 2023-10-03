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
import CreateRecetteScreen from "./screens/CreateRecetteScreen";
import MyRecetteScreen from "./screens/MyRecetteScreen";
import { auth } from './firebase';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" headerMode="none">
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="postModal" component={PostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
