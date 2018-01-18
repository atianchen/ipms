/**
 *  Project CRUD
 * Created by jensen on 2017/1/18.
 */
const express = require('express');
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db')
const wb = require('../../util/webutils');
const logger = require("../../util/logger").log;
const exporter = require("../../util/exporter");
const appContext = require('../../ctx/appContext');
const {Person,Contract,Project,Milestone,MilestoneType,Division} = require('../../domain/model');
const projectService = require('../../service/projectService');
const projectStatus = require('../../db/constants').projectStatus;
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = {};//req.body.q||{};
    if (wb.containsQueryParam(req,"q","name"))
    {
        q["name"]= {$regex: req.body.q.name.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","projectId"))
    {
        q["projectId"]= {$regex: req.body.q.projectId.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","sysProj"))
    {
        q["sysProj"]= {$regex: req.body.q.sysProj.trim(), $options:'i'};
    }

    q.division = {$in:appContext.getLoginUser(req).divisions};
    page.sort={sysProj:1};
    let model = {};
    async.waterfall([
        (cb)=>{
            if (wb.containsQueryParam(req,"q","pmId"))
            {
                orm.find((new Person()).getCollection(),{userId:{$regex: req.body.q.pmId.trim(), $options:'i'}},null,(err,rs)=>
                {
                    q.pmId = {$in:rs.map((x)=>{return x._id;})};
                    cb(err);
                });
            }
            else {
                cb(null);
            }
        },
        (cb)=>{
            if (wb.containsQueryParam(req,"q","contractId"))
            {
                orm.find((new Contract()).getCollection(),{contractId:{$regex: req.body.q.contractId.trim(), $options:'i'}},null,(err,rs)=>
                {
                    q.contractId = {$in:rs.map((x)=>{return x._id;})};
                    cb(err);
                });
            }
            else {
                cb(null);
            }
        },
        (cb)=>{
            orm.pagejoinquery(new Project(),["pmId","contractId"],q,page,function(err,rs)
            {
                model.page = page;
                model.data = rs;
                cb(err);
            });
        }
    ], function (err, result) {
        if (err)
            res.json({err:err});
        else
        {
            res.json(model);
        }
    });
   //


});
router.post("/get",function(req,res)
{
    let p = new Project();
    let model = {};
    db.getDb(function(err,connection)
    {
        if (err)res.json({err:err});
        else {
            async.waterfall([
                function(cb)
                {
                    orm.find((new MilestoneType()).getCollection(),{},null,function(err,rs){
                        if (rs) {
                            model.milestoneTypes = rs;
                        }
                        cb(err);
                    },connection);

                },
                function(cb)
                {
                    orm.find((new Contract()).getCollection(),{division:{$in:appContext.getLoginUser(req).divisions}},null,function(err,rs){
                        if (rs) {
                            model.contracts = [];
                            rs.forEach((r)=>{model.contracts.push({_id:r._id,contractId:r.contractId,abbr:r.customerAbbr,po:r.processOpen});});
                        }
                        cb(err);
                    },connection);

                },
                (cb)=>{
                    orm.find((new Division()).getCollection(),{},{code:1},function(err,divisions) {
                        model.divisions = divisions;
                        cb(err);
                    });
                },
                function(cb)
                {
                    orm.find((new Person()).getCollection(),{},null,function(err,rs){
                        if (rs) {model.persons = rs;}
                        cb(err);
                    },connection);

                } ,function(cb)
                {
                    //,{type:"Implementation"}
                    orm.find((new Milestone()).getCollection(),{},{type:1,seq:1},function(err,rs){
                        if (rs) {model.milestones = rs;}
                        cb(err);
                    },connection);

                } ,
                function(cb)
                {
                    if (req.body && req.body.id) {
                        orm.get(p.getCollection(), req.body.id, function (err, rs) {
                            if (rs) {
                                model.data = rs;
                            }
                            cb(err);
                        });
                    }
                    else {
                        cb(null);
                    }
                }
            ], function (err) {
                try { connection.close(); } catch (e){logger.err(e);}
                 res.json(model);
            });
        }
    });
});

router.post("/save",function(req,res)
{
    let p = new Project();
    orm.find(p.getCollection(),{sysProj:req.body.proj.sysProj.trim()},null,function(err,ps)
    {
        if (err) {
            res.json({err: err});
        }
        else
        {
            if (ps.length>0)
            {
                res.json({err:"Duplicate ProjectId"});
            }
            else {
                wb.mappingObj(req,req.body.proj,p,orm.operTypes.INSERT);
                projectService.save(p,function(err,rs)
                {
                    res.json({err:err,data:rs});
                });
                if (p.completedMilestone && p.completedMilestone.length<0)
                    p.completedMilestone = null;
            }
        }
    });

});
router.post("/update",function(req,res)
{
    let p = new Project();
    orm.get(p.getCollection(),req.body.proj._id,function(err,rs)
{
    Object.assign(p, rs);
    wb.mappingObj(req,req.body.proj,p,orm.operTypes.UPDATE);
    projectService.update(p,req.body.proj._id,function(err,rs)
    {
        res.json({err:err,data:rs});
    });

});

});
router.post("/finish",function(req,res)
{
    let p = new Project();
    orm.get(p.getCollection(),req.body.proj._id,function(err,rs)
    {
        Object.assign(p, rs);
        p.status = projectStatus.STATUS_END;
        projectService.update(p,req.body.proj._id,function(err,rs)
        {
            res.json({err:err,data:rs});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new Project();
    orm.delById(p.getCollection(),req.body.proj._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
router.post("/exportProj",function(req,res)
{
    let q = {};
    if (wb.containsQueryParam(req,"q","name"))
    {
        q["name"]= {$regex: req.body.q.name.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","projectId"))
    {
        q["projectId"]= {$regex: req.body.q.projectId.trim(), $options:'i'};
    }
    if (wb.containsQueryParam(req,"q","sysProj"))
    {
        q["sysProj"]= {$regex: req.body.q.sysProj.trim(), $options:'i'};
    }
   orm.aliasFind(new Project(),["pmId","contractId"],q,{projectId:1},(err,rs)=>{
        let target = exporter.exportXls( [{title:"Division",name:"division"},{title:"ContractId",name:"contract.contractId"},{title:"SignedYear",name:"contract.ssignedYear"},{title:"System Project Id",name:"sysProj"}
                ,{title:"Sales Man",name:"contract.salesMan"},{title:"Project Line",name:"contract.productLine"},{title:"Customer Name",name:"contract.customerName"},
                {title:"Customer Abbr",name:"contract.customerAbbr"}, {title:"Currency",name:"contract.currency"}, {title:"ContractAmt",name:"contract.amt"}
                , {title:"Impl(%)",name:"contract.imp"}, {title:"Cus(%)",name:"contract.cus",exp:function(item){ if (item.contract.imp && item.contract.imp>0)return 100-item.contract.imp;else return 100;}},
                {title:"CashIn Opening",name:"contract.cashInOpen"},{title:"Progress Opening",name:"contract.processOpen"},
                {title:"Project Name",name:"name"},{title:"Planed Milestones",name:"planedMilestones"},{title:"Current Milestone",name:"currentMilestone"}
                ,{title:"PM",name:"pm.userId"}]
               // ,{title:"Project Id",name:"projectId"},{title:"Project Type",name:"type"},{title:"Task Id",name:"taskId"}
        //,{title:"Planned Milestone",name:"planedMilestones",join:"/"},{title:"Current Milestone",name:"currentMilestone"},{title:"PM",name:"pm.name"},{title:"Division",name:"division"},{title:"Create Date",name:"createDate",type:"date",format:"DD/MM/YYYY"}]
            ,rs
        ,{url:"/uploads/proj.xls"});
        res.download(target.path);
  });

});
module.exports = router;