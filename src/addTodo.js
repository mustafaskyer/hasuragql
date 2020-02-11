import React, { useState } from 'react';
import { 
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
 } from 'react-native';

 import { useMutation } from '@apollo/react-hooks';
 import {INSERT_TODO} from '../data/mutations';
import { GET_TODOS } from '../data/quires';

 const addTodo = () => {
     const [text, setText] = useState("")
     const [insertTodo, { loading, error }] = useMutation(INSERT_TODO)
     return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                onChangeText={(t) => setText(t)} 
                value={text}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    insertTodo({
                        variables: {text},
                        refetchQueries: [{ query: GET_TODOS }]
                    })
                    setText("")
                }}
                disabled={loading || text === ""}
            >
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
     )
 }

 const styles = StyleSheet.create({
     container: {
         flexDirection: 'row',
         alignItems: 'center',
         marginBottom: 20
     },
     input: {
         flex:1,
         borderWidth: 1,
         borderColor: '#000',
         margin: 10,
         marginLeft: 0,
         padding: 10,
         fontSize: 24
     },
     button: {
         backgroundColor: 'blue',
         padding: 13
     },
     buttonText: {
         color: '#FFF',
         fontSize: 20
     }
 })

 export default addTodo