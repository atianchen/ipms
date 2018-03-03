/**
 * Created by jensen on 2017/1/13.
 */
const express = require('express');
require('./db/db').initdb();
const db = require('./db/db.js');
const session = require('express-session');
const bodyParser = require('body-parser');
const Constants = require('./ctx/constants').Constants;
const bots  = require('./slack/bots');
const http = require('http');
const https = require('https');
const fs = require('fs');
const encrypt = require('./util/encryptutils');
const app = express();
/**
 * init slack's bot
 */
//bots.initBot("hmt");//bots.initBot("jensen");
app.use(express.static('static'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const router = express.Router();
/**
 * enable session
 */
app.use(session({
    resave: true, saveUninitialized: true,
    secret: 'pmo',
    cookie: { secure: false },
    touch:function()
    {

    }
}));
app.use(function (req, res, next) {
    var url = req.originalUrl;
     if (url != "/login" && url.indexOf("/entry")<0 && !req.session[Constants.LOGIN_USER_KEY]  && url.indexOf("/upe")<0) {
         return res.redirect("/login");
     }
    next();
});
/**
 * use ejs engine for render html
 */
app.set("view engine","ejs");

app.use('/', require('./action/index'));
app.use('/project/person', require('./action/project/person'));
app.use('/project/contract', require('./action/project/contract'));
app.use('/project/project',require('./action/project/project'));
app.use('/project/record', require('./action/project/record'));
app.use('/project/', require('./action/project/upload'));
app.use('/setting/role', require('./action/setting/role'));
app.use('/setting/milestone', require('./action/setting/milestone'));
app.use('/setting/milestonetype', require('./action/setting/milestonetype'));
app.use('/setting/menu', require('./action/setting/menu'));
app.use('/setting/action',require('./action/setting/action'));
app.use('/setting/position',require('./action/setting/position'));
app.use('/setting/currency',require('./action/setting/currency'));
app.use('/setting/menugroup',require('./action/setting/menugroup'));
app.use('/setting/division',require('./action/setting/division'));
app.use('/slack/',require('./action/slack/api'));
app.use('/entry/',require('./action/project/entry'));
app.use('/rpt/',require('./action/report/charts'));
app.use('/rpt/',require('./action/report/report'));
app.use('/rpt',require('./action/report/careport'));
app.use('/upe',require('./action/upe/index'));
app.use('/im',require('./action/IM/cashinforecast'));
app.use('/im',require('./action/IM/accuralforecast'));
app.use('/im',require('./action/IM/weekplan'));
const server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Pmo app listening at http://%s:%s', host, port);
});
server.on('error', function(err) {console.log(err); });
// your express configuration here




/*var privateKey  = fs.readFileSync('./cert/private.pem', 'utf8');
var certificate = fs.readFileSync('./cert/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);*/



