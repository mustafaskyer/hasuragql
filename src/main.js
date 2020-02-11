import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import { GRAPHQL_ENDPOINT } from '../config';
import { INSERT_USERS } from '../data/mutations';
import TodoList from './todoList';
import AddTodo from './addTodo';
const Main = ({ token, user }) => {
    const [client, setClient] = useState(null)

    useEffect(() => {
        const { id, name, isNewUser } = user
        const client = new ApolloClient({
            uri: GRAPHQL_ENDPOINT,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if(isNewUser){
            client.mutate({
                mutation: INSERT_USERS,
                variables: { id, name }
            })
        }

        setClient(client)
    }, [])
    if (!client)
        return <ActivityIndicator color={'red'} size={'small'}/>

    return (
        <ApolloProvider client={client}>
            <View>
                <AddTodo />
                <TodoList />
            </View>
        </ApolloProvider>
    )
}

export default Main