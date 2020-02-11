import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/react-hooks';

import { UPDATE_TODO } from '../data/mutations';

const TodoItem = ({ item }) => {
    const { id, text, is_completed } = item
    const [updateTodo, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_TODO)

    if(updateError) return <Text>Error ${error.message}</Text>
    return (
        <View style={styles.container}>
            <Text
                style={[styles.icon, is_completed && styles.completed]}
                onPress={() => {
                    if (!updateLoading) {
                        updateTodo({
                            variables: { id, isCompleted: !is_completed }
                        })
                    }
                }}
            >
                {is_completed ? '✅' : '❌'}
            </Text>
            <Text style={[styles.item, is_completed && styles.completed]}>
                {text}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        // paddingLeft: 0
    },
    item: {
        padding: 10,
        fontSize: 24
    },
    icon: {
        fontSize: 30,
    },
    completed: {
        color: "lightgray"
    }
})

export default TodoItem;