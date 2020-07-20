import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NannyInfoScreen = props => {
    const currentNanny = props.route.params.nanny;
    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <View style={styles.box}>
                    <View style={styles.titleLine}>
                        <Text>User Info</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>First Name: </Text>
                            <Text style={styles.outputText}>{currentNanny.firstName}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Last Name: </Text>
                            <Text style={styles.outputText}>{currentNanny.lastName}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Email: </Text>
                            <Text style={styles.outputText}>{currentNanny.email}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Address: </Text>
                            <Text style={styles.outputText}>{currentNanny.address}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Postal Code: </Text>
                            <Text style={styles.outputText}>{currentNanny.postalCode.toUpperCase()}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>City: </Text>
                            <Text style={styles.outputText}>{currentNanny.city}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Povince: </Text>
                            <Text style={styles.outputText}>{currentNanny.province}</Text>
                    </View>
                    <View style={styles.nameContainer}>
                            <Text>Country: </Text>
                            <Text style={styles.outputText}>{currentNanny.country}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
export const screenOptions = navData => {
    return {
        headerTitle: navData.route.params.nannyName,
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 20
    },
    card: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
    },
    box:{
        borderColor: '#ccc',
        borderWidth: 1,
        marginVertical: 10
    },
    titleLine: {
        borderColor: '#ccc',
        borderBottomWidth: 1,
        alignItems: 'center',
        marginBottom: 5
    },
    nameContainer: {
        flexDirection: 'row'
    },
    outputText: {
        color: '#888'
    }
});


export default NannyInfoScreen;