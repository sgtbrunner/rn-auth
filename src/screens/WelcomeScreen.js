import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/auth-context';

function WelcomeScreen() {
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get(
        'https://rn-authentication-4607e-default-rtdb.firebaseio.com/message.json?auth=' +
          token
      )
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{message}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
