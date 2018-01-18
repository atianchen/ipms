/**
 * Created by jensen on 2017/1/23.
 */
const SlackClient = require('./client').SlackClient;
const async = require('async');
const orm = require('../db/orm');
const wb = require('../util/webutils');
const Person = require('../domain/model').Person;
const Project = require('../domain/model').Project;
const Action = require('../domain/model').Action;
const timeutil = require('../util/timeutils');
const logger = require("../util/logger").log;
const errorMsg = "I do not understand what you say";
const commands={
};
/**
 * verify slack's account whether or not bind userId
 * @param u
 * @param callback
 */
function verifyAccount(u,callback)
{
    orm.find((new Person()).getCollection(),{slack:u},null,function(err,ps)
    {
       if (err || ps.length<1)
           callback(new Error("Please bind your account!"));
       else
           callback(null,ps[0]);
    });
}

class Bot
{
    constructor(name)
    {
        this.name = name;
    }
    run()
    {
        //hmt :xoxb-139868038480-DX49oijZfaumtYHhwTj4o8q6
        this.client = new SlackClient({
            webToken:"xoxb-126633678258-8t6up2ArWHwMBQPDgg3Lvo7b",//"xoxb-139868038480-DX49oijZfaumtYHhwTj4o8q6",
            token:"xoxb-126633678258-8t6up2ArWHwMBQPDgg3Lvo7b"//"xoxb-139868038480-DX49oijZfaumtYHhwTj4o8q6"
        });
        this.client.connect(this);
    }
    sendMsg(channel,msg)
    {
        if (msg.attachments) {
            msg.username = this.name;
            this.client.sendComplexMessage(channel, "", msg, function (err, rs) {
                if (err)
                    console.log(err);
            });
        }
        else
            this.client.sendTxtMessage(channel, msg);
    }
    trigger(msg)
    {
        let _self = this;
        this.performAction(msg,function(err,rs)
        {
            if (err)
                if (err instanceof Error)
                     _self.client.sendTxtMessage(msg.channel,err.message);
                else
                    _self.client.sendTxtMessage(msg.channel,err);
            else if (rs) {
                if (rs.attachments) {
                    rs.username = _self.name;
                    _self.client.sendComplexMessage(msg.channel, "", rs, function (err, rs) {
                        if (err)
                         console.log(err);
                    });
                }
                else
                  _self.client.sendTxtMessage(msg.channel, rs);
            }
        });
    }
    performAction(msg,callback) {
        try
        {
            let _self = this;
            if (msg.channel) {
                this.client.webClient.channels.info(msg.channel, function (err, rs) {
                    if (rs && rs.ok && rs.channel) {
                        _self.executeAction(msg,callback,rs.channel)
                    }
                    else{
                        _self.executeAction(msg,callback,null);
                    }
                });
            }
      }
      catch (e)
      {
          logger.err(e);
      }
    }
    executeAction(msg,callback,channel)
    {
        try
        {
            if (msg.text) {
                let ary = msg.text.split(" ");
                /**
                 * all action is lowercase
                 * @type {string}
                 */
                let action = ary[0].trim().toLowerCase();
                let args = (ary.length > 1) ? ary.slice(1) : [];

                if (commands[action]) {
                    commands[action](msg, callback);
                }
                else {
                    orm.find((new Action()).getCollection(), {code: action}, null, function (err, actions) {
                        if (err) {
                            if (channel==null) {
                                callback(new Error(errorMsg), null);
                            }
                            else
                            {
                                callback(null,null);
                            }
                        }
                        else {
                            if (actions.length > 0) {
                                if (typeof(channel)!="undefined" && channel==null) {
                                    let action = actions[0];
                                    if (action.auth) {
                                        verifyAccount(msg.user, function (err, user) {
                                            if (err)
                                                callback(err);
                                            else
                                                eval(actions[0].script);
                                        });
                                    }
                                    else {
                                        eval(actions[0].script);
                                    }
                                }
                                else
                                {
                                    callback("Sorry,I can't handle your request.Please resend the message to  robot that named hmt!");
                                }

                            }
                            else {
                                if (typeof(channel)!="undefined" && channel==null) {
                                    callback(new Error(errorMsg), null);
                                }
                                else {
                                    callback(null,null);
                                }
                            }
                        }
                    });
                }

            }
        }
        catch (e)
        {
            logger.err(e);
        }
    }
}
var bot = null;
exports.initBot = (name)=>{
    bot = new Bot(name);
    bot.run();
};
exports.getBot=()=>{return bot;};