import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

import PropTypes from 'prop-types';

import { AuthSession } from 'expo';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import jwtDecoder from 'jwt-decode';
import queryString from 'query-string';

import {
    AUTH_CLIENT_ID,
    AUTH_DOMAIN,
    ID_TOKEN_KEY,
    NONCE_KEY,
    AUTH_NAMESPACE
} from '../config';

const generateNonce = async () => {
    const nonce = String.fromCharCode.apply(
        null,
        await Random.getRandomBytesAsync(16)
    );
    await SecureStore.setItemAsync(NONCE_KEY, nonce)
    return nonce;
}

const Auth = ({ onLogin, token, onLogout }) => {
    const handleLoginPress = async () => {
        const nonce = await generateNonce()
        AuthSession.startAsync({
            authUrl: `${AUTH_DOMAIN}/authorize?` +
                queryString.stringify({
                    client_id: AUTH_CLIENT_ID,
                    response_type: "id_token",
                    scope: "openid profile email",
                    redirect_uri: AuthSession.getRedirectUrl('https://auth.expo.io/@mustafaskir/rnstack'),
                    nonce
                })
        }).then(result => {
            console.log('@result ', result)
            if (result.type === 'success') {
                decodeToken(result.params.id_token)
            } else if (result.params && result.params.error) {
                Alert.alert(
                    'Error',
                    result.params.error_description || 'Something went wrong while logging in.'
                )
            }
        })
    }

    

    const decodeToken = token => {
        const decodedToken = jwtDecoder(token)
        console.log('@decodedToken ', decodedToken)
        const { nonce, sub, email, name, exp } = decodedToken

        SecureStore.getItemAsync(NONCE_KEY).then(storedNonce => {
            if (nonce === storedNonce) {
                SecureStore.setItemAsync(
                    ID_TOKEN_KEY,
                    JSON.stringify({
                        id: sub,
                        email,
                        name,
                        exp,
                        token
                    })
                ).then(onLogin(decodedToken[AUTH_NAMESPACE].isNewUser))
            } else {
                Alert.alert('Error ', "Nonce don't match");
                return;
            }
        })
    }
    return (
        <View >
            {token && (
                <Button
                    title={"logout"}
                    onPress={onLogout}
                />
            )}
            {
                !token && (
                    <Button
                        title={"Login"}
                        onPress={handleLoginPress}
                    />
                )
            }

        </View>
    )
}

Auth.propTypes = {
    onLogin: PropTypes.func
}

export default Auth