
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import PaymentFormView from './PaymentFormView';

const BookingPaymentScreen = props => {
    return(
        <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.textWrapper}>
            <Text style={styles.infoText}>
              Amount Owed: $10
            </Text>
          </View>
          <View style={styles.cardFormWrapper}>
            <PaymentFormView {...props}/>
          </View>
        </ScrollView>
      </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    textWrapper: {
      margin: 10
    },
    infoText: {
      fontSize: 18,
      textAlign: 'center'
    },
    cardFormWrapper: {
      padding: 10,
      margin: 10
    }
  });

export default BookingPaymentScreen;