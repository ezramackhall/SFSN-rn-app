import React from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import { CreditCardInput } from 'react-native-input-credit-card';
import { FontAwesome } from '@expo/vector-icons';

const PaymentFormView = props => {

    const { onSubmit, submitted, error } = props;

    return (
        <View>
        <View>
            <CreditCardInput onChange={()=> {}} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title='Pay Now'
            onPress={() => onSubmit()}
          />
          {/* Show errors */}
          {error && (
            <View style={styles.alertWrapper}>
              <View style={styles.alertIconWrapper}>
                <FontAwesome name="exclamation-circle" size={20} style={{ color: '#c22' }} />
              </View>
              <View style={styles.alertTextWrapper}>
                <Text style={styles.alertText}>{error}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center'
    },
    buttonWrapper: {
      padding: 10,
      zIndex: 100
    },
    alertTextWrapper: {
      flex: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    alertIconWrapper: {
      padding: 5,
      flex: 4,
      justifyContent: 'center',
      alignItems: 'center'
    },
    alertText: {
      color: '#c22',
      fontSize: 16,
      fontWeight: '400'
    },
    alertWrapper: {
      backgroundColor: '#ecb7b7',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderRadius: 5,
      paddingVertical: 5,
      marginTop: 10
    }
  });

export default PaymentFormView;