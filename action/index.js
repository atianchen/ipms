/**
 * login logout and index page
 *
 */
const express = require('express');
const router = express.Router();
const orm = require('../db/orm');
const db = require('../db/db');
const {Person,Menu,MenuGroup,Role} = require('../domain/model');
const encrypt = require('../util/encryptutils');
const Constants = require('../ctx/constants').Constants;
var {ObjectId} = require('mongodb');
router.use(function timeLog(req, res, next) {
    next();
})
router.get("/",function(req,res)
{
    initUserContext(req.session[Constants.LOGIN_USER_KEY],function(err,groups,gs,ms,menuMap)
    {

        res.render("index",{user:req.session[Constants.LOGIN_USER_KEY],gs:groups,ms:ms,gmap:gs,mmap:menuMap});
    });
});

router.get("/index",function(req,res)
{
    initUserContext(req.session[Constants.LOGIN_USER_KEY],function(err,groups,gs,ms,menuMap)
    {
        res.render("index",{user:req.session[Constants.LOGIN_USER_KEY],gs:groups,ms:ms,gmap:gs,mmap:menuMap});
    });

});
function initUserContext(user,callback)
{

    db.getDb(function(err,conn)
    {
        if (err)
            callback(err);
        else
        {
            orm.find((new MenuGroup()).getCollection(),null,{seq:1},function(err,groups){
                    if (err)callback(err);
                    else
                    {
                        let gs = {};
                        groups.forEach(function(g)
                        {
                            gs[g._id.toString()]=g;
                            g.childs = [];
                        });
                        orm.find((new Menu()).getCollection(),{parentId: null},{seq:1},function(err,ms)
                        {
                            if (err)
                            {
                                callback(err);
                            }
                            else {
                                let menuMap = {};
                                ms.forEach(function (m) {
                                    menuMap[m._id.toString()] = m;
                                    m.childs = [];
                                    gs[m.groupId.toString()].childs.push(m);
                                });
                                // parentId:{$ne:null}  {$in:user.purviews}new ObjectId("58be11d5c062b1058fbcfbdc")
                                orm.find((new Menu()).getCollection(), {_id:{$in:user.purviews.map(x=>new ObjectId(x.toString()))}}, {seq:1}, function (err, ms) {
                                    if (err)
                                    {
                                        callback(err);
                                    }
                                    else {
                                        ms.forEach(function (m) {
                                            if (m.parentId)
                                                 menuMap[m.parentId.toString()].childs.push(m);
                                        });
                                        callback(null,groups,gs,ms,menuMap);
                                    }
                                }, conn);
                            }
                        },conn)
                    }
                }
            ,conn);

        }
    });
}

router.get("/login",function(req,res)
{
    res.render("login",null);

});
router.post("/login",function(req,res)
{
    let p = new Person();
    orm.find(p.getCollection(),{userId:req.body.userId},null,function(err,users)
    {
        if (users && users.length > 0) {
            let u = users[0];
            if (true)//(u.pwd && u.pwd==encrypt.md5(req.body.pwd))
            {
                orm.find((new Role()).getCollection(),{name:u.role},null,function(err,roles) {
                    if (err || roles.length<1) {
                        res.json({err: "Unauthorized access"});
                    }
                    else {
                        if (typeof(roles[0].allowLogin)!="undefined" && roles[0].allowLogin) {
                            u.purviews = roles[0].menuIds;
                            if (req.session[Constants.LOGIN_USER_KEY]) {
                                delete req.session[Constants.LOGIN_USER_KEY];
                                req.session[Constants.LOGIN_USER_KEY] = null;
                            }
                            req.session[Constants.LOGIN_USER_KEY] = u;
                            res.json({user: u.userId});
                        }
                        else {
                            res.json({err: "Unauthorized access"});
                        }
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
router.get("/logout",function(req,res)
{
    delete req.session[Constants.LOGIN_USER_KEY];
    req.session[Constants.LOGIN_USER_KEY] = null;
    res.render("login",null);

});
module.exports = router;