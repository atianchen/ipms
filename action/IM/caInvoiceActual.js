/*
* Created by Andersen 2017-02-06
* */

const express = require('express');
const router = express.Router();
const  orm = require('../../db/orm');
const wb = require('../../util/webutils');
const {CAInvoiceActual,Contract,Project,Currency} = require('../../domain/model');

router.post("/list",function(req,res){
    let page=wb.getPagination(req);
    let q = req.body.q||{};
    orm.paginquery(new CAInvoiceActual(),q,page,function(req,res)
    {
        res.json({page:page,data:rs});
    });
});

router.post("/get",function(req,res){
    let p = new CAInvoiceActual();
    orm.get(p.getCollection(),req.body.id,function(err,rs)
    {
        res.json({data:rs});
    });
});

router.post("/save",function(req,res){
    let p = new CAInvoiceActual();
    wb.mappingObj(req,req.body.CAInvoiceactual,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});

router.post("/update",function(req,res){
    let p = new CAInvoiceActual();
    orm.delById(p.getCollection(),req.body.CAInvoiceActual._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });
});

router.post("/del",function(req,res){
    let p = new CAInvoiceActual();
    orm.delById(p.getCollection(),req.body.CAInvoiceActual._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

})

module.exports = router;