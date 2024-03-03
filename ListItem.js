import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Platform, StatusBar, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem = ({ item, btn, refresh }) => {

    const handleOpenInMaps = () => {
        const lat = item.properties.lat;
        const lon = item.properties.lon;
        const url = Platform.select({
            ios: `maps://app?daddr=${lat},${lon}`,
            android: `geo:${lat},${lon}?q=${lat},${lon}(Location)`
        });

        Linking.openURL(url);
    };

    const containsName = (list, targetName) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].properties && list[i].properties.name === targetName) {
                return true;
            }
        }
        return false;
    };

    const addNewData = async () => {
        try {
            const existingDataString = await AsyncStorage.getItem('@myData');
            let existingData = existingDataString ? JSON.parse(existingDataString) : [];

            if (containsName(existingData, item.properties.name)) {
                console.log("data already exists");
                Alert.alert('', 'Ravintola on jo lisätty', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                return false;
            }

            existingData = existingData.concat(item);

            const updatedDataString = JSON.stringify(existingData);

            await AsyncStorage.setItem('@myData', updatedDataString);

            Alert.alert('', 'Ravintola tallennettu', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);

            return true;
        } catch (error) {
            console.error('Error adding new data:', error);
        }
    };

    const removeData = async () => {
        try {
            const existingDataString = await AsyncStorage.getItem('@myData');
            let existingData = existingDataString ? JSON.parse(existingDataString) : [];

            const updatedData = existingData.filter(x => x.properties.name !== item.properties.name);
            const updatedDataString = JSON.stringify(updatedData);

            await AsyncStorage.setItem('@myData', updatedDataString);

            refresh();
        } catch (error) {
            console.error('Error removing data:', error);
        }
    };

    const handleButtonPress = async () => {
        if (btn === "Tallenna") {
            if (addNewData()) {
                console.log("new data saved");
            }
        }
        else if (btn === "Poista") {
            removeData();
            console.log("removed data");
        }
    }


    return (
        <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.properties.address_line1}</Text>
            <View style={styles.buttonContainer}>
                <Button style={[styles.button, styles.firstButton]} title="Avaa kartalla" onPress={handleOpenInMaps} />
                <Button style={styles.button} title={btn} onPress={handleButtonPress} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    listItem: {
        backgroundColor: '#ffff',
        borderRadius: 10,
        marginBottom: 10,
        padding: 20,
    },
    listItemText: {
        fontSize: 16,
    },
});



export default ListItem;