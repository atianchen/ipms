const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const {CAInvoiceActual,Project} = require('../../domain/model');
const projectStatus = require('../../db/constants').projectStatus;
const logger = require("../../util/logger").log;
const {ObjectId} = require('mongodb');


router.post("/listCashinAccrual",function(req,res){
    let page = wb.getPagination(req);
    let user = req.session[Constants.LOGIN_USER_KEY];
    let q = {};//req.body.q||{};
    if (wb.containsQueryParam(req,"q","contractId"))
    {
        q["contractId"]= {$regex: req.body.q.contractId.contractId.trim(), $options:'i'};
    }

    //q["memberIds"]={$in:[ObjectId(user._id)]};
    q["division"] = {$in:user.divisions};
    q["status"]={ $ne : projectStatus.STATUS_END };
    orm.pagejoinquery(new Project(),["pmId","contractId"],q,page,function(err,rs){
        let model = {};
        model.page=page;
        model.data=rs;
        res.json(model);
    });
});

router.post("/saveCashinAccrualActual",function(req,res){
    let user = req.session[Constants.LOGIN_USER_KEY];
    let item = req.body.CAInvoiceActual;
    let depot={};
    db.getDb(function(err,connection){
        if(err){
            model.err=err;
        }
        else{
            let ca = new CAInvoiceActual();
            ca.personId = ObjectId(user._id);
            ca.contractId = ObjectId(item.contractId);
            ca.projectId =  ObjectId(item.projectId);
            ca.amount =  parseFloat(item.amount);
            ca.currency =  parseInt(item.currency);
            ca.cash =  parseInt(item.cash);
            ca.cashindate =  item.cashindate;
            ca.completemilestone =  item.completemilestone;
            ca.confirmdate =  parseInt(item.confirmdate);
            ca.invoiceamount =  parseFloat(item.invoiceamount);
            ca.invoicedate =  parseInt(item.invoicedate);

            /*      if (item._id) {
                      item._id = ObjectId(item._id);
                      db.update(wcf.getCollection(), {_id:item._id}, item, function (err, rs) {
                          depot[item.confirmdate]=item;
                          callback(err, rs);
                      }, connection);
                  }
                  else {*/
            db.insertOne(ca.getCollection(), ca, function (err, rs) {
                depot[rs._id]=rs;
                res.json({CAInvoiceActual:rs});
            }, connection);
            // }
        }

    });
});

router.post("/getCashinAccrualActual",function(req,res){
   orm.aliasGet(new Project(),["pmId","contractId"],req.body.projId,(err,rs)=>{
       if (err)
           res.json({err:err});
       else{
           let model = {};
           //model["proj"] = proj;
           model.proj=rs;
           res.json(model);
       }
   })
});



module.exports= router;
