const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const {CashinActual,Project} = require('../../domain/model');
const logger = require("../../util/logger").log;
const {ObjectId} = require('mongodb');

router.post("/listCashinActual",function(req,res){
    let page = wb.getPagination(req);
    let q={};
    if (wb.containsQueryParam(req,"q","contractId"))
    {
        q["contractId"]= {$regex: req.body.q.contractId,$options:'i'};
    }

    orm.pagejoinquery(new Project(),["pm","contractId"],q,page,function(err,rs){
        let model = {};
        model.page=page;
        model.data=rs;
        res.json(model);
    });
});

router.post("/saveCashinActual",function(req,res){
  let item = req.body.CashinActual;
  let depot ={};
  let contract1 = req.body.contract;
   db.getDb(function(err,connection){
        if(err){
            model.err=err;
        }
      else{
          let ca= new CashinActual();
          ca.contractId = ObjectId(item.contractId);
          ca.projectId =  ObjectId(item.projectId);
          ca.amount =  parseFloat(item.amount);
          ca.currency =  parseInt(item.currency);
          ca.cash =  parseInt(item.cash);
          ca.cashindate =  item.cashindate;
          ca.entrydate = item.entrydate;
          db.insertOne(ca.getCollection(), ca, function (err, rs) {
              depot[rs._id]=rs;
              res.json({CashinActual:rs});
          }, connection);
      }

  })
});

router.post("/getCashinActual",function(req,res){
    orm.aliasGet(new Project(),["pmId","contractId"],req.body.projId,(err,rs)=>{
        if (err)
            res.json({err:err});
        else{
            let model = {};
            model.proj=rs;
            res.json(model);
        }
    })

});


module.exports = router;