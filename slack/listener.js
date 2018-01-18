/**
 * Created by atian on 2017/1/12.
 */
var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';
var web = new WebClient("xoxp-126407969763-126475858770-126460545427-f53bce80635af17988a9b45d331536a3");
let rtm = new RtmClient("xoxb-126633678258-8t6up2ArWHwMBQPDgg3Lvo7b",{logLevel:'error',dataStore:new MemoryDataStore(),autoReconnect:true,autoMark:true});
var connected = false;
console.log(RTM_EVENTS.MESSAGE);
var obj = {
    "text": "Your Task List",
    "attachments": [
        {
            "fallback": "Choose Your Task",
            "title": "Pls Choose Your Task",
            "callback_id": "comic_1234_xyz",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "AECOM-HR2016v3",
                    "text": "AECOM-HR2016v3",
                    "type": "button",
                    "value": "OK"
                },
                {
                    "name": "RFID",
                    "text": "RFID",
                    "type": "button",
                    "value": "bad"
                }
            ]
        }
    ]
};
rtm.on(RTM_EVENTS.MESSAGE, function (msg) {
    console.log(msg.channel+":"+msg.user);
   // rtm.sendMessage(obj,msg.channel);
    if (msg.text==="bind") {
        web.chat.postMessage(msg.channel, "Operate Successful,Thank you", obj, function (err, res) {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Message sent: ', res);
            }
        });
    }
    else
    {
        console.log("other:"+msg);
    }
});

/*rtm.on("im:history", function (msg) {
    console.log("receive:"+msg);
});*/
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    //rtm.sendMessage("change one!", "C3QHUMVLL");
   // connected = true;

});
//var welcome = ()=>{if (connected)rtm.sendMessage("change second", "C3QHUMVLL");else setTimeout(welcome,1000)};
//setTimeout(welcome,1000);

var obj1 = {
    "text": "Your Task List",
    "attachments": [
        {
            "fallback": "AM,Task:RFID",
            "title": "Pls Confirm",
            "callback_id": "comic_1234_xyz",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "SURE",
                    "text": "CONFIRM",
                    "type": "button",
                    "value": "CONFIRM"
                }
            ]
        }
    ]
};
var obj3= {
    "text": "Good Job,Thank you",
    "attachments": [
        {
            "fallback": "AM,Task:RFID",
            "title": "Pls Confirm",
            "callback_id": "comic_1234_xyz",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "SURE",
                    "text": "CONFIRM",
                    "type": "button",
                    "value": "CONFIRM"
                }
            ]
        }
    ]
};
//"AM,Task:RFID!Operate Successful,Thank you"
/*
web.chat.postMessage('C3QHUMVLL', "Operate Successful,Thank you","", function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});

*/


rtm.start();
