import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItem from './ListItem';

function FavouritesScreen({ route, navigation }) {
    const [existingData, setExistingData] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        console.log("Data has changed");
    }, [existingData]);

    const loadData = async () => {
        const existingDataString = await AsyncStorage.getItem('@myData');
        let parsedData = existingDataString ? JSON.parse(existingDataString) : [];
        setExistingData(parsedData);

    }

    return (
        <View style={styles.listContainer}>
            <FlatList
                style={styles.list}
                data={existingData}
                extraData={existingData}
                renderItem={({ item }) => <ListItem item={item} btn="Poista" refresh={loadData} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    list: {
        flex: 1,
    },
});


export default FavouritesScreen;