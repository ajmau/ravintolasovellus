import React, { useState, useEffect } from 'react';
import {  Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FavouritesScreen from './favouritesScreen';
import HomeScreen from './HomeScreen';

const Stack = createStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Ravintolat lähellä" component={HomeScreen} options={({ navigation, route }) => ({
                    headerRight: () => (<Button
                        onPress={() => navigation.navigate('Suosikit')}
                        title="Suosikit"
                        color="#007AFF"
                    />),
                })} />
                <Stack.Screen name="Suosikit" component={FavouritesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
