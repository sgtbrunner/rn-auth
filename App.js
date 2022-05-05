import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';

import AuthContextProvider, { AuthContext } from './src/context/auth-context';
import IconButton from './src/components/ui/IconButton';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { Colors } from './src/constants/styles';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authenticationContext = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) authenticationContext.authenticate(storedToken);

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) return <AppLoading />;

  return <Navigation />;
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authenticationContext = useContext(AuthContext);

  function authenticatedPressHandler() {
    authenticationContext.logout();
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
        headerRight: ({ tintColor }) => {
          return (
            <IconButton
              icon='exit'
              color={tintColor}
              size={24}
              onPress={authenticationContext.logout}
            />
          );
        },
      }}
    >
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authenticationContext = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authenticationContext.isAuthenticated && <AuthStack />}
      {authenticationContext.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style='light' />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
