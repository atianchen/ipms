/**
 * Created by jensen on 2017/2/20.
 */
const upeClient = require('../upe/upeClient').UpeClient;
const async = require('async');
const AccessToken = require('../domain/model').AccessToken;
const orm = require('../db/orm');
const moment = require("moment");
const db = require('../db/db');
exports.getToken=function(callback)
{
    orm.find((new AccessToken()).getCollection(),{},null,function(err,rs)
    {
        let token = new AccessToken();
        if (err) {
            callback(err);
        }
        else
        {
            if (rs && rs.length>0)
            {
                Object.assign(token,rs[0]);
            }
            if (token.token && moment().unix()<=token.limitDate)
            {
                callback(null,token);
            }
            else
            {
                let uc = new upeClient();
                uc.getToken(function(err,tok)
                {
                    if (err) {
                        callback(err);
                    }
                    else
                    {
                        token.token = tok.data["access_token"];
                        token.limitDate = moment().add(tok["expires_in"],"s").unix();
                        if (token._id)
                        {
                            orm.update(token,token._id,function(err,rs)
                            {
                                if (err)
                                    callback(err);
                                else
                                    callback(null,token);
                            });
                        }
                        else
                        {
                            orm.insert(token,function(err,rs)
                            {
                                if (err)
                                    callback(err);
                                else
                                    callback(null,token);
                            });
                        }
                    }
                });
            }
        }
    });
};