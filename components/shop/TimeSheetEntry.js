import React from 'react';
import { StyleSheet, View, Text } from  'react-native';

import {convertDate} from '../../store/actions/helpers/dateHandler'


const TimeSheetEntry = props => {
    const selected = props.selected;
    return (
            <View>
                <Text>{convertDate(props.startTime)}</Text>
                <Text>{convertDate(props.endTime)}</Text>
            </View>
    )
};

const styles = StyleSheet.create({
});

export default TimeSheetEntry;