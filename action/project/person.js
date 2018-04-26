/**
 * Person Info CRUD
 * Created by jensen on 2017/1/15.
 */
const express = require('express');
const router = express.Router();
const db = require('../../db/db');
const async = require('async');
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const {Role,Person,Position,Division} = require('../../domain/model');
const encrypt = require('../../util/encryptutils');
const Constants = require('../../ctx/constants').Constants;
const appContext = require('../../ctx/appContext');
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};
    q.division = {$in:appContext.getLoginUser(req).divisions};
    orm.pagejoinquery(new Person(),["positionId"],q,page,function(err,rs)
    {
        res.json({page:page,data:rs,q:q});

    });

});
router.post("/get",function(req,res)
{
    let p = new Person();
    let model = {};
    db.getDb(function(err,connection)
    {
        if (err)
        {
            model.err = err;
        }
        else
        {
            async.waterfall([
                (cb)=>{
                    orm.find((new Role()).getCollection(),{},null,function(err,roles)
                    {
                        if (roles)
                            model.roles = roles;
                        cb(err);
                    },connection);
                }, (cb)=>{
                    orm.find((new Division()).getCollection(),{},null,function(err,divisions)
                    {
                        if (divisions)
                            model.divisions = divisions;
                        cb(err);
                    },connection);
                },

                (cb)=>{
                    orm.find((new Position()).getCollection(),{},null,function(err,positions)
                    {
                        if (positions)
                          model.positions = positions;
                        cb(err);
                    },connection);
                },
                (cb)=>
                {
                    if (req.body && req.body.id) {
                        orm.get(p.getCollection(), req.body.id, function (err, rs) {
                            if (rs)
                              model.data = rs;
                            cb(err);
                        },connection);
                    }
                    else
                    {
                        cb(null);
                    }
                }
            ], (err)=> {
                try { connection.close(); } catch (e){logger.err(e);}
                if (err) model.err = err;
                res.json(model);
            })
        }
    });


});
router.post("/save",function(req,res)
{
    let p = new Person();
    wb.mappingObj(req,req.body.person,p,orm.operTypes.INSERT);
    if (req.body.pwd)
    {
        p.pwd = encrypt.md5(req.body.pwd);
    }
    orm.find(p.getCollection(),{userId:p.userId.trim()},null,function(err,ps)
    {
        if (err)
            res.json({err:err});
        else {
            if (ps.length>0)
            {
                res.json({err:"Duplicate userId"});
            }
            else {
                orm.insert(p, function (err, rs) {
                    res.json({data: rs});
                });
            }
        }

    });

});
router.post("/update",function(req,res)
{
    let p = new Person();
    orm.get(p.getCollection(),req.body.person._id,function(err,rs)
    {
        Object.assign(p, rs);
        console.log(req.body.person.divisions)
        wb.mappingObj(req,req.body.person,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.person._id,function(err,rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new Person();
    orm.delById(p.getCollection(),req.body.person._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
router.post("/savePwd",function(req,res)
{
    let p = new Person();
    orm.get(p.getCollection(),req.session[Constants.LOGIN_USER_KEY]._id,function(err,rs)
    {
        Object.assign(p, rs);
        p.pwd = encrypt.md5(req.body.pwd);
        let id1 =p._id;
        orm.update(p,id1,function(err,result)
        {
            res.json({data:p});
        });

    });

});
module.exports = router;
