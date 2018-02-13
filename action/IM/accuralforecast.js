const express = require("express");
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const {Accrualforecast,Contract,Project,Currency} = require('../../domain/model');


router.post("/list",function(req,rs){

});

router.post("/save",function(req,rs){


});

router.post("/update",function(req,rs){

});


router.post("/del",function(req,rs){
    let p = new Accrualforecast();
    orm.delById(p.getCollection(),req.body.accrualforecast._id,function(err,rs){
       if(err)
           res.json({err:err});
       else
           res.json({data:rs});
    });

});