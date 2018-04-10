/**
 * contact manage
 * Created by atian on 2017/1/16.
 */
const express = require('express');
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const moment = require("moment");
const appContext = require('../../ctx/appContext');
const {Contract,Currency,Division} = require('../../domain/model');
/**
 * contact list
 */
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = {};//req.body.q||{};
    if (wb.containsQueryParam(req,"q","contractId"))
    {
        q["contractId"]= {$regex: req.body.q.contractId.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","customerName"))
    {
        q["customerName"]= {$regex: req.body.q.customerName.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","customerAbbr"))
    {
        q["customerAbbr"]= {$regex: req.body.q.customerAbbr.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","salesMan"))
    {
        q["salesMan"]= {$regex: req.body.q.salesMan.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","productLine"))
    {
        q["productLine"]= {$regex: req.body.q.productLine.trim(), $options:'i'};
    }
    if (!req.body.createDate1 ||  req.body.createDate1.toString().length<1) {
        req.body.createDate1 = moment().subtract(3,"months");
    }
    else
        req.body.createDate1 = wb.praseDate( req.body.createDate1);
    if (!req.body.createDate2  ||  req.body.createDate2.toString().length<1) {
        req.body.createDate2 = moment();
    }
    else
        req.body.createDate2 = wb.praseDate( req.body.createDate2);
    if (req.body.createDate1 || req.body.createDate2 )
    {
        let cq = {};
        if (req.body.createDate1)
        {
            cq.$gte=req.body.createDate1.unix();
        }
        if (req.body.createDate2 )
        {
            cq.$lte=req.body.createDate2.unix();
        }
        q.createDate=cq;
    }
    page.sort={contractId:1};
    q.division = {$in:appContext.getLoginUser(req).divisions};
    orm.pagingquery(new Contract(),q,page,function(err,rs)
    {
        let model = {page:page,data:rs};
        if (req.body.createDate1)
            model.createDate1=wb.formatDate(req.body.createDate1);
        if (req.body.createDate2)
            model.createDate2=wb.formatDate(req.body.createDate2);
        orm.find((new Contract()).getCollection(),{},null,(err,contracts)=>{
            model.contracts = contracts;
            res.json(model);
        });

    });

});

/**
 * get contract if req param include id
 */
router.post("/get",function(req,res)
{
   let model = {};
    orm.find("currency",{},{createDate:1},function(err,rs)
    {
        if (err)
        {
            res.json({err: err});
        }
        else {
            orm.find((new Division()).getCollection(),{},{code:1},function(err,divisions)
            {
               if (err)
                   res.json({err:err});
               else
               {
                   model.currency = rs;
                   model.divisions = divisions;
                   if (req.body && req.body.id) {
                       orm.get((new Contract()).getCollection(), req.body.id, function (err, rs) {
                           model.data = rs;
                           res.json(model);
                       });
                   }
                   else {
                       res.json(model);
                   }
               }
            });

        }
    });

});
/**
 * save contract
 */
router.post("/save",function(req,res)
{
    let p = new Contract();
    orm.find(p.getCollection(),{contractId:req.body.contract.contractId.trim()},null,function(err,ps)
    {
        if (err)
            res.json({err:err});
        else {
            if (ps.length>0)
            {
                res.json({err:"Duplicate ContractId"});
            }
            else {
                wb.mappingObj(req, req.body.contract, p, orm.operTypes.INSERT);
                if (p.imp) {
                    p.cus = 100 - p.imp;
                }
                orm.insert(p, function (rs) {
                    res.json({data: rs});
                });
            }
        }

    });

});
/**
 * modify contract
 */
router.post("/update",function(req,res)
{
    let p = new Contract();
    orm.get(p.getCollection(),req.body.contract._id,function(err,rs)
    {
        Object.assign(rs, p);
        wb.mappingObj(req,req.body.contract,p,orm.operTypes.UPDATE);
        if (p.imp) {
            p.cus = 100 - p.imp;
        }
        orm.update(p,req.body.contract._id,function(rs)
        {
            res.json({data:p});
        });

    });

});
/**
 * del contract
 */
router.post("/del",function(req,res)
{
    let p = new Contract();
    orm.delById(p.getCollection(),req.body.contract._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;
