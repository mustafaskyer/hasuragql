import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { useQuery } from '@apollo/react-hooks';
import TodoItem from './todoItem';

import { GET_TODOS } from '../data/quires';
const TodoList = () => {
    const { loading, error, data } = useQuery(GET_TODOS)
    
    if (error) return <Text>Error ${error.message}</Text>
    return (
        <View style={styles.container}>
            {
                loading ?
                    <ActivityIndicator size={'small'} color='red' />
                    :
                    <FlatList
                        data={data.todos}
                        renderItem={({ item }) => <TodoItem item={item} />}
                        keyExtractor={item => item.id.toString()}
                    />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 500
    }
})

export default TodoList;