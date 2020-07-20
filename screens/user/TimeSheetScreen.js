import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/ui/HeaderButton';
import {getNannyTimeSheet} from './sevices/timeSheetService';
import Colors from '../../constants/Colors';
import TimeSheetEntry from '../../components/shop/TimeSheetListEntry';

const TimeSheetScreen = props => {
    const [timeSheet, setTimeSheet] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useSelector(state=> state.auth.userData);

    const getTimeSheet = useCallback( async () => {
        setIsLoading(true);
        const resultTimeSheet = await getNannyTimeSheet(currentUser.id);
        setTimeSheet(resultTimeSheet);
        setIsLoading(false);
    });

    useEffect( () => {
        getTimeSheet();
    }, [currentUser])

    useEffect (() => {
        const unsubscribe = props.navigation.addListener(
            'focus', 
            getTimeSheet
        );

        return () => {
            unsubscribe();
        };
    },[getTimeSheet]);

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator color={Colors.primary} size='large'/>
            </View>
        )
    }

    return (
        <View>
            <FlatList
            data={timeSheet}
            keyExtractor={item => item.startTime}
            renderItem={itemData=> (
                <TimeSheetEntry 
                    startTime={itemData.item.startTime} 
                    endTime={itemData.item.endTime}
                />
            )}
            />
        </View>
    )
}

export const screenOptions = navData => {
    return {
        headerTitle: 'Time Sheet',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Cart' 
                    iconName='ios-menu' 
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title='Cart' 
                        iconName='ios-add' 
                        onPress={() => {
                            navData.navigation.navigate('TimeSheetEntry');
                        }}
                    />
                </HeaderButtons>
                )
    };
};

const styles = StyleSheet.create({
    card:{
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 10,
        alignItems: 'center'
    },
    centered: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
});

export default TimeSheetScreen;