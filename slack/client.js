/**
 * Created by jensen on 2017/1/23.
 */
var RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;;
class Client
{
  constructor(config)
  {
      this.config = config;
  }
  connect(listener)
  {
      this.webClient = new WebClient(this.config.token);
      this.rtmClient = new RtmClient(this.config.token,{logLevel:'error',dataStore:new MemoryDataStore(),autoReconnect:true,autoMark:true});
      this.rtmClient.on(RTM_EVENTS.MESSAGE, function (msg) {
        listener.trigger(msg);
      });
      this.rtmClient.start();
  }
  sendTxtMessage(channel,message,callback)
  {
    this.rtmClient.sendMessage(message,channel);
  }

  sendComplexMessage(channel,title,message,callback)
  {
      this.webClient.chat.postMessage(channel, title, message, function (err, res) {
          if (err) {
              callback(err);
          } else {
              callback(null,res);
          }
      });
  }


}
exports.SlackClient = Client;
