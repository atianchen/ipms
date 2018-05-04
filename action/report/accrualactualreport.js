const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const timeutils = require('../../util/timeutils');
const {AccrualActual,Project,Contract} = require('../../domain/model');
router.post("/AccrualActualReport",function(req,res){
    let page = wb.getPagination(req);
    let q=req.body.q||{};
    let model = {};
      if(!req.body.entrydate1||req.body.entrydate1.toString().length<1){

        req.body.entrydate1 = moment().subtract(30,"days");
    }
    else
    {
        req.body.entrydate1 = wb.praseDate(req.body.entrydate1);
    }
    if(!req.body.entrydate2||req.body.entrydate2.toString().length<1){
        req.body.entrydate2 = moment();
    }
    else{
        req.body.entrydate2 =wb.praseDate(req.body.entrydate2);
    }

    if (req.body.entrydate1 || req.body.entrydate2 )
    {
        let cq = {};

        if (req.body.entrydate1)
        {
            cq.$gte=req.body.entrydate1.unix();
        }
        if (req.body.entrydate2)
        {
            cq.$lte=req.body.entrydate2.add(1, 'days').unix();
        }
        q.entrydate=cq;
    }
   page.sort = {entrydate:-1};
   console.log(q);
   orm.pagejoinquery(new AccrualActual(),[],q, page, function(err,rs){
        if (req.body.entrydate1)
            model.entrydate1 = wb.formatDate(req.body.entrydate1);
        if (req.body.entrydate2)
            model.entrydate2 = wb.formatDate(req.body.entrydate2);
        model.page=page;
        model.data=rs;
        res.json(model);
    });
});

module.exports = router;