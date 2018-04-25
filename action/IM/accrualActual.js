const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const projectStatus = require('../../db/constants').projectStatus;
const {AccrualActual,Project,Contract} = require('../../domain/model');
const logger = require("../../util/logger").log;
const {ObjectId} = require('mongodb');

router.post("/listAccrualActual",function(req,res){
    let page =wb.getPagination(req);
    let q={};
    q["status"] = { $ne : projectStatus.STATUS_END };
    if(wb.containsQueryParam(req,"q","projectId")){
        q["projectId"]= {$regex: req.body.q.projectId, $options:'i'};
        let project1 = req.body.q.projectId;
    }
    orm.pagejoinquery(new Project(),["pmId"],q,page,function(err,rs){
        let model = {};
        model.page=page;
        model.data=rs;
        res.json(model);
    });
});
router.post("/saveAccrualActual",function(req,res){
    let item = req.body.AccrualActual;
    //console.log(item);
    let depot ={};
    let test1 =req.body;
    let project1 = req.body.proj;
    let milestone1 = req.body.AccrualActual.completemilestone;
   //console.log(project1);
    db.getDb(function(err,connection){
        if(err){
            model.err=err;
        }
        else{
            let ca= new AccrualActual();
            let p = new Project();
            ca.projectId =  req.body.proj._id;
            console.log(ca.projectId);
            ca.completemilestone =  item.completemilestone;
            console.log(ca.completemilestone);
            ca.accrual = parseFloat(item.accrual);
            ca.confirmdate =  item.confirmdate;
            ca.entrydate = item.entrydate;
            orm.get(p.getCollection(),ca.projectId,function(err,rs){
                    Object.assign(p,rs);
                    p.completedMilestone =ca.completemilestone;
                   // console.log(p.accComAccrual);
                    p.accComAccrual= p.accComAccrual+ parseFloat(ca.accrual);
                   // console.log(typeof(p.currentYearAccAccrual));
                    //console.log(typeof(ca.accrual));
                    p.currentYearAccAccrual = parseFloat(p.currentYearAccAccrual) + parseFloat(ca.accrual);
                    //console.log(p.currentYearAccAccrual);
                    orm.update(p,req.body.proj._id,function(rs){

                });
            });
            db.insertOne(ca.getCollection(), ca, function (err, rs) {
                depot[rs._id]=rs;
                res.json({AccrualActual:rs});
            }, connection);
        }
    })
});
router.post("/getAccrualActual",function(req,res){
    orm.aliasGet(new Project(),["pmId"],req.body.projId,(err,rs)=>
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
