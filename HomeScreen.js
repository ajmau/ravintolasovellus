import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Platform, StatusBar, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import ListItem from './ListItem';

function HomeScreen({ navigation }) {

    const [distance, setDistance] = useState('500');
    const [itemCount, setItemCount] = useState('20');
    const [data, setData] = useState(null);
    const [location, setLocation] = useState(null);
    const [loadingText, setLoadingText] = useState('');

    const fetchData = async (lat, lon) => {
        try {
            const response = await fetch(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},${distance}&bias=proximity:${lon},${lat}&limit=${itemCount}&apiKey=4b5b5088f05c439f871c4bf03dbbcdf0`);
            const json = await response.json();
            setData(json.features);
            json.features.forEach(item => {
                console.log(item.properties.formatted);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleButtonPress = async () => {
        setLoadingText("Haetaan ravintoloita...");
        try {
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {
                Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
                return;
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            fetchData(location.coords.latitude, location.coords.longitude);

        } catch (error) {
            console.error('Error handling button press:', error);
        }
        setLoadingText("");
    };


    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <View style={styles.inputContainer}>
                    <Text style={{ marginRight: 10 }}>max etäisyys:</Text>
                    <TextInput
                        style={styles.input}
                        value={distance}
                        onChangeText={setDistance}
                        placeholder="500"
                        keyboardType="numeric"
                    />
                    <Text style={{ marginRight: 10, marginLeft: 10 }}>max määrä:</Text>
                    <TextInput
                        style={styles.input}
                        value={itemCount}
                        onChangeText={setItemCount}
                        placeholder="20"
                        keyboardType="numeric"
                    />
                </View>
                <Button onPress={handleButtonPress} title="Hae ravintolat" />
                <Text>{loadingText}</Text>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    style={styles.list}
                    data={data}
                    extraData={data}
                    renderItem={({ item }) => <ListItem item={item} btn="Tallenna" refresh={null} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    buttonContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    listContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    list: {
        flex: 1,
    },
});

export default HomeScreen;