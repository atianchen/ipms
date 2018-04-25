const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const {CashinActual,Project,Contract} = require('../../domain/model');
const logger = require("../../util/logger").log;
const {ObjectId} = require('mongodb');

router.post("/listCashinActual",function(req,res){
    let page = wb.getPagination(req);
    let q={};
    let contractId1;
    let contractId2 =null;
    if (wb.containsQueryParam(req,"q","contractId"))
    {

        let contractId1 = req.body.q.contractId;
            orm.find((new Contract()).getCollection(),{contractId: contractId1},null,function(err,contracts){
            if(err)
            {
                model.err=err;
            }
            else {
                //model.contact=contracts;
                contractId2 = contracts[0]._id;
                q["contractId"] =contractId2;
            }
        });


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
  let contract1=req.body.proj.contract._id;
  console.log(item);

 //  console.log(req.body);
  //console.log(req);
  let depot ={};
   db.getDb(function(err,connection){
        if(err){
            model.err=err;
        }
      else{
          let p = new Contract();
          let ca= new CashinActual();
          ca.contractId = req.body.proj.contract._id;
       // console.log(ca.contractId);
          ca.projectId =  req.body.proj._id;
       //   console.log(ca.projectId);
          ca.amount =  parseFloat(req.body.proj.contract.amount);
          ca.currency =  parseInt(item.currency);
          ca.cash =  parseInt(item.cash);
          ca.cashindate =  item.cashindate;
          ca.entrydate = item.entrydate;
          orm.get(p.getCollection(),ca.contractId,function(err,rs){
                Object.assign(p,rs);

              p.accReceiptAmt = ca.cash + p.accReceiptAmt;

              orm.update(p,req.body.proj.contract._id,function(rs){
                  console.log(rs);
              });
            });

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