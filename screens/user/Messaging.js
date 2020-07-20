import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/ui/HeaderButton';
import Fire from '../../Fire';
import { useSelector } from 'react-redux';

const createMessageKey = (userOne, userTwo) => {
    let result;
    if(userOne <= userTwo){
        result = userOne + userTwo;
    }else{
        result = userTwo + userOne;
    }
    return result;
}

const Messaging = props => {

  const [messages, setMessages] = useState([]);
  const name = useSelector(state=> state.auth.userData.firstName) 
  const userId = useSelector(state => state.auth.userId);

  const user = {
      name,
      userId
  };

  useEffect(() => {
    componentDidMount();
    return () => {
        componentWillUnmount();
    }
  }, [])

  const componentDidMount = () => {
      console.log("bkscbkbksackascbksabcak");
    const holder = [{
        _id: "1",
        timestamp: '2020-07-15T22:04:12.277Z'
    }]; 
    Fire.shared.setUserToMessage(createMessageKey(userId, props.route.params.id));
    Fire.shared.on(message => {
        console.log(message);
        holder.unshift(message);
        console.log(holder);
    })
        
        setMessages(holder);
  };

  const componentWillUnmount = () => {
    Fire.shared.off();
  }

    return (
      <GiftedChat
        messages={messages}
        onSend={Fire.shared.send}
        user={user}
      />
    );
}

export const screenOptions = navData => {
    return {
        headerTitle: 'Messaging',
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
            )
    };
}

export default Messaging;