/**
 * Created by jensen on 2017/1/23.
 */
const express = require('express');
const router = express.Router();
const db = require('../../db/db');
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const moment = require('moment');
const request = require('superagent');
const async = require('async');
const timeutil = require('../../util/timeutils')
const Project = require('../../domain/model').Project;
const Person = require('../../domain/model').Person;
const logger = require("../../util/logger").log;
const CLIENT_ID="126407969763.126629727365";
const CLIENT_SECRET = "1deda3f0c442559b35fee54e4ed271cb";
router.get('/', (req, res) => {
    res.redirect(`https://slack.com/oauth/authorize?client_id=${CLIENT_ID}&scope=bot&redirect_uri=${escape('https://f07960c1.ngrok.io/slack/oauth')}`);
});
router.post('/button', (req, res) => {
    console.log('post');
});
router.get('/oauth', (req, res) => {
    let code = req.query.code;
    console.log(code);
    request
        .get(`https://slack.com/api/oauth.access?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${escape('https://f07960c1.ngrok.io/slack/oauth')}`)
        .end((err, result) => {
            if (err) {
                console.log(err);
                return res.send('An error occured! Please try again later');
            }
            console.log(res.body);

            let botToken = result.body.bot.bot_access_token;
            console.log('Got the token:', botToken);


            res.send('You have successfully installed Wikibot! You can now start using it in your Slack team, but make sure to invite the bot to your channel first with the /invite command!');
        });
});
router.post("/api",function(req,res)
{
    console.log("response body:"+req.body);
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello world!");
});

module.exports = router;