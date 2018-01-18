/**
 * Created by jensen on 2017/2/17.
 */
const request = require('superagent');
const config={
    appId:"76ab2a124318c783 ",
    secret:"9c6dd6e61af71212379f0083b844c55f02757574d3c8ba107c0279c2d5a3"
}
const urls = {
    token:"https://openapi.upesn.com/token/",
    certified:"https://openapi.upesn.com/certified/userInfo/"//:code?access_token=ACCESS_TOKEN"
}

/**
 * interface for youspace
 */
class  UpeClient
{
    getToken(callback){
        request
            .get(urls.token)
            .query({ appid: config.appId })
            .query({ secret: config.secret })
            .end(function(err, res){
                if (err)
                    callback(err);
                else {
                    callback(err, res.body);
                }
            });
    }
    certified(userCode,token,callback)
    {
        request
            .get(urls.certified+userCode)
            .query({ access_token: token })
            .query({ secret: config.secret })
            .end(function(err, res){
                if (err)
                    callback(err);
                else {
                    callback(err, JSON.parse(res.text));
                }
            });
    }
}
exports.UpeClient = UpeClient
