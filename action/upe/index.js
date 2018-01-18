/**
 * Created by jensen on 2017/2/17.
 */
const express = require('express');
const router = express.Router();
const Person = require('../../domain/model').Person;
const orm = require('../../db/orm');
const tokenService = require('../../service/tokenService');
const encrypt = require('../../util/encryptutils');
const UpeClient = require("../../upe/upeClient").UpeClient;
const Constants = require('../../ctx/constants').Constants;
router.get("/",function(req,res)
{
    console.log("enter  upes");
   let userCode = req.query.code;
   let uc = new UpeClient();
   tokenService.getToken(function(err,tok)
   {
       if (err)
       {
           res.render("login", null);
       }
       else {
           uc.certified(userCode, tok.token, function (err, rs) {
               if (rs && rs.data && rs.data["member_id"]) {
                   orm.find((new Person()).getCollection(), {upeMemberId: rs.data["member_id"]}, null, function (err, us) {
                       if (us && us.length > 0) {
                           req.session[Constants.LOGIN_USER_KEY] = us[0];
                           res.render("index", {user:us[0]});
                       }
                       else {
                           res.render("bindupe", {upeMemberId: rs.data["member_id"],spaceUser:rs.data,target:"/index"});
                       }
                   });
               }
               else {
                   res.render("login", null);
               }
           });
       }
   });
});
router.get("/entry",function(req,res)
{
    let userCode = req.query.code;
    let uc = new UpeClient();
    tokenService.getToken(function(err,tok)
    {
        if (err)
        {
            res.render("login", null);
        }
        else {
            uc.certified(userCode, tok.token, function (err, rs) {
                if (rs && rs.data && rs.data["member_id"] && rs.data["member_id"].toString().trim().length>0) {
                    orm.find((new Person()).getCollection(), {upeMemberId: rs.data["member_id"]}, null, function (err, us) {
                        if (us && us.length > 0) {
                           // req.session[Constants.LOGIN_USER_KEY] = us[0];
                           // res.render("index", {user:us[0]});
                            res.redirect("/entry/attendance?user="+rs.data["member_id"]);
                        }
                        else {
                            res.render("bindupe", {upeMemberId: rs.data["member_id"],spaceUser:rs.data,target:"/upe/punchcard"});
                        }
                    });
                }
                else {
                    res.render("login", null);
                }
            });
        }
    });
});
router.post("/bind",function(req,res)
{
    let upeMemberId = req.body.upeMemberId;
    let p = new Person();
    orm.find(p.getCollection(),{userId:req.body.userId},null,function(err,users)
    {
        if (users && users.length > 0) {
            Object.assign(p,users[0]);
            if (p.pwd && p.pwd==encrypt.md5(req.body.pwd))
            {
                Object.assign(p,users[0]);
                p.upeMemberId = upeMemberId;
                orm.update(p,p._id,function(err,rs)
                {
                    if (err) {
                        res.json({err: err});
                    }
                    else
                    {
                        res.json({user: p});
                    }
                });
            }
            else {
                res.json({err:"invalid password"});
            }
        }
        else {
            res.json({err:"user not found"});
        }
    });



});
module.exports = router;