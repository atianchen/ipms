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
const {Contract,Currency,Division,Person} = require('../../domain/model');
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

    page.sort={contractId:1};
    q.division = {$in:appContext.getLoginUser(req).divisions};
    //console.log(q);
    orm.pagingquery(new Contract(),q,page,function(err,rs)
    {
        let model = {page:page,data:rs};
        orm.find((new Contract()).getCollection(),{},{contractId:1},(err,contracts)=>{
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
            orm.find((new Person()).getCollection(),{},{name:1},function(err,persons) {
                if(err)
                    res.json({err:err});
                else {
                    orm.find((new Division()).getCollection(), {}, {code: 1}, function (err, divisions) {
                        if (err)
                            res.json({err: err});
                        else {
                            model.currency = rs;
                            model.persons=persons;
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
       // p.amt = parseFloat(req.body.contract.amt);
        //p.cashInOpen  = parseFloat(req.body.contract.cashInOpen);
        //p.processOpen =parseFloat(req.body.contract.processOpen);
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