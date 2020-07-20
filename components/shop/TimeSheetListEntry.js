import React from 'react';
import { StyleSheet, View, Text } from  'react-native';

import {convertDate} from '../../store/actions/helpers/dateHandler'


const TimeSheetListEntry = props => {
    const selected = props.selected;
    return (
            <View style = {styles.card}>
                <Text>{convertDate(props.startTime)}</Text>
                <Text>{convertDate(props.endTime)}</Text>
            </View>
    )
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
    }
});

export default TimeSheetListEntry;