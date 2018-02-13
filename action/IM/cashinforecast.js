/*
* Cash-in forecast by andersen 2018-02-07
*/

const express = require("express");
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const {Cashinforecast,Contract,Project,Currency} = require('../../domain/model');


router.post("/list",function(req,res){

});

router.post("/update",function(req,res){

});


router.post("/save",function(req,res){

});

router.post("/del",function(req,res){
    let p = new Cashinforecast();
    orm.delById(p.getCollection(),req.body.cashinforecast._id,function(err,rs){
        if(err)
            res.json({err:err});
        else(rs)
            res.json({data:rs});
    });


});
