const functions = require('firebase-functions');
const fetch = require('node-fetch');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.database.ref('childminding/requests/{id}')
    .onCreate((snapshot, context) => {
    const root = snapshot.ref;
    let messages = [];

    return root.parent.parent.parent.child('/users/nannys/').once('value').then(function(snapshot){
        console.log('Fire1');
        console.log(snapshot);
        snapshot.forEach(function(childSnapshot){
            console.log('Fire2');
            let expoToken = childSnapshot.val().pushNotificationToken
            console.log(childSnapshot);
            if(expoToken){
                messages.push({
                    "to": expoToken,
                    "body": "New Note Added"
                })
            }
        })
        return Promise.all(messages)
    }).then(messages => {
        fetch('https://exp.host/--/api/v2/push/send', 
        {
            method: "POST",
            headers: {
                "Accept" : "application/json",
                "Content" : "application/json"
            },
            body: JSON.stringify(messages)
        })
    })
})