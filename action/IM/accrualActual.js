const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const {AccrualActual,Project} = require('../../domain/model');
const logger = require("../../util/logger").log;
const {ObjectId} = require('mongodb');


router.post("/listAccrualActual",function(req,res){
    let page =wb.getPagination();
    let q={};
    if(wb.containsQueryParam(req,"q","contractId")){
        q["contractId"]= {$regex: req.body.q.contractId.contractId.trim(), $options:'i'};
    }
    q["status"]
    orm.find((new Project()).getCollection(),["pmId","contractId"],q,page,function(req,rs){
        let model={};
        model.page=page;
        model.data=rs.data;
        res.json(model);
    });
});



router.post("/saveAccrualActual",function(req,res){
    let item = req.body.AccrualActual;
    let depot ={};
    db.getDb(function(err,connection){
        if(err){
            model.err=err;
        }
        else{
            let ca= new AccrualActual();
            ca.contractId = ObjectId(item.contractId);
            ca.projectId =  ObjectId(item.projectId);
            ca.amount =  parseFloat(item.amt);
            ca.currency =  parseInt(item.currency);
            ca.completemilestone =  parseInt(item.completemilestone);
            ca.confirmdate =  item.confirmdate;
            ca.entrydate = item.entrydate;
            db.insertOne(ca.getCollection(), ca, function (err, rs) {
                depot[rs._id]=rs;
                res.json({AccrualActual:rs});
            }, connection);
        }
    })
});


router.post("/getAccrualActual",function(req,res){
    orm.aliasGet(new Project(),["pmId","contractId"],req.body.projId,(err,rs)=>
    {
        if(err)
           res.json(err);
        else {
            let model= {};
            model.proj=rs;
            res.json(model);
        }
    });
});



module.exports= router;
