import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Auth from './src/auth';
import Main from './src/main';

import * as SecureStore from 'expo-secure-store';
import { ID_TOKEN_KEY } from './config';
export default function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    handleLogin()
  }, [])

  console.log('@token ', token)
  handleLogin = (isNewUser = false) => {
    SecureStore.getItemAsync(ID_TOKEN_KEY)
      .then(session => {
        if (session) {
          const sessionObject = JSON.parse(session)
          const { exp, token, id, name } = sessionObject
          if (exp > Math.floor(new Date().getTime() / 1000)) {
            setToken(token)
            setUser({ id, name, isNewUser })
          }else {
            handleLogout()
          }
        }
      })
  }

  const handleLogout = () => {
    SecureStore.deleteItemAsync(ID_TOKEN_KEY)
    setToken(null)
  }
  return (
    <View style={styles.container}>
      {token && user && <Main token={token} user={user} />}
      <Auth
        token={token}
        onLogin={handleLogin}
        onLogout={handleLogout}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
