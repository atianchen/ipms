/**
 * Created by jensen on 2017/1/25.
 */
const express = require('express');
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db')
const wb = require('../../util/webutils');
const moment = require("moment");
const timeutils = require('../../util/timeutils');
const projectService = require('../../service/projectService');
const appContext = require('../../ctx/appContext');
const projectStatus = require('../../db/constants').projectStatus;
const exporter = require("../../util/exporter");
const {EntryRecord,Contract,Person,Project} = require('../../domain/model');
router.post("/exportRecord",function(req,res)
{
    let param = JSON.parse(req.body.q);
    let q = {};
    if (param.person)
    {
        q.person= param.person.trim();
    }
    let createDate1,createDate2;
    if (!param.createDate1) {
        createDate1 = moment().subtract(3,"days");
    }
    else
        createDate1 = wb.praseDate(param.createDate1);
    if (!param.createDate2) {
        createDate2 = moment();
    }
    else
        createDate2 = wb.praseDate( param.createDate2);
    if (createDate1 || createDate2 )
    {
        let cq = {};
        if (createDate1)
        {
            cq.$gte=createDate1.unix();
        }
        if (createDate2 )
        {
            cq.$lte=createDate2.add(1, 'days').unix();
        }
        q.createDate=cq;
    }
    q.division = {$in:appContext.getLoginUser(req).divisions};
    console.log(q);
    orm.find((new EntryRecord()).getCollection(),q,{createDate:-1},(err,rs)=>
    {
        let target = exporter.exportXls( [{title:"User ID",name:"person",click:"_id"},{title:"User Name",name:"personName",click:"_id"},{title:"Task Id",name:"taskId"},{title:"SysProj",name:"sysProj"},{title:"Addr",name:"addr"},{title:"Period",name:"period"}
                ,{title:"Cash-In Amount",name:"cash"} ,{title:"Completed Milestone",name:"completedMilestone"},{title:"Desc",name:"desc"},{title:"StartTime",name:"createDate",type:"date",format:"DD/MM/YYYY H:mm"},{title:"EndTime",name:"modifiedDate",type:"date",format:"DD/MM/YYYY H:mm"}]
            // ,{title:"Project Id",name:"projectId"},{title:"Project Type",name:"type"},{title:"Task Id",name:"taskId"}
            //,{title:"Planned Milestone",name:"planedMilestones",join:"/"},{title:"Current Milestone",name:"currentMilestone"},{title:"PM",name:"pm.name"},{title:"Division",name:"division"},{title:"Create Date",name:"createDate",type:"date",format:"DD/MM/YYYY"}]
            ,rs
            ,{url:"/uploads/record.xls"});
        res.download(target.path);
    });
});
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};

    if (!req.body.createDate1 ||  req.body.createDate1.toString().length<1) {
        req.body.createDate1 = moment().subtract(3,"days");
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
            cq.$lte=req.body.createDate2.add(1, 'days').unix();
        }
        q.createDate=cq;
    }
    page.sort = {createDate:-1};
    q.division = {$in:appContext.getLoginUser(req).divisions};
    orm.pagingquery(new EntryRecord(),q,page,function(err,rs)
    {
        let model = {page:page,data:rs};
        if (req.body.createDate1)
            model.createDate1=wb.formatDate(req.body.createDate1);
        if (req.body.createDate2)
            model.createDate2=wb.formatDate(req.body.createDate2);
        orm.find((new Person()).getCollection(),{},null,(err,persons)=>{
            model.persons = persons;
            res.json(model);
        });

    });


});
router.post("/getPlanMilestones",(req,res)=>
{
    if (req.body.sysProj) {
        orm.find((new Project()).getCollection(),{sysProj:req.body.sysProj},null,(err,projs)=>
        {
           if (err)
                res.json({err:err});
            else if (projs.length<1)
                res.json({err:new Error("TASK NOT FOUND")});
            else {
                res.json({proj:projs[0]});
            }
        });
    }
    else
    {
        res.json({err:new Error("TASK NOT FOUND")});
    }

});
router.post("/getUserTasks",(req,res)=>{
    db.getDb(function(err,conn)
    {
        if (err)
            res.json({err:err});
        else
        {
            let model = {};
            async.waterfall([
                (cb)=>{
                    orm.find((new Person()).getCollection(),{userId:req.body.user},{userId:1},(err,users)=>
                    {
                        if (err)
                            cb(err);
                        else
                            cb(null,users[0]);
                    },conn);
                },(person,cb)=>{
                    orm.find((new Project()).getCollection(),{$or:[{memberIds:{$in:[person._id]}},{pmId:person._id}],status:{ $ne : projectStatus.STATUS_END }},{createDate:1},(err,rs)=>{
                        if (err)cb(err);
                        let tasks=[];
                        rs.forEach((item,index)=>{
                            // if ( !item.completedMilestone  || !item.status || item.status!=projectStatus.STATUS_END)
                            // {
                            tasks.push(item);
                            //}
                        });

                        model.projs = tasks;
                        cb(null);
                    });
                }
            ],(err)=>
            {
                try {
                    conn.close();
                } catch (e) {
                    logger.err(e);
                }
                if (err)
                    res.json({err: err});
                else
                {
                    res.json(model);
                }
            });

        }
    });
});
router.post("/getRelationData",(req,res)=>{
    db.getDb(function(err,conn)
    {
       if (err)
           res.json({err:err});
       else
       {
           let model = {};
           async.waterfall([/*
               (cb)=>{
                   orm.find((new Project()).getCollection(),null,{projectId:1},(err,projs)=>
                   {
                       model.projs = projs;
                       cb(err);
                   },conn);
               },*/
               (cb)=>{
                   orm.find((new Person()).getCollection(),null,{userId:1},(err,users)=>
                   {
                       model.users = users;
                       cb(err);
                   },conn);
               }
           ],(err)=>
           {
               try {
                   conn.close();
               } catch (e) {
                   logger.err(e);
               }
               if (err)
                   res.json({err: err});
               else
               {
                   res.json(model);
               }
           });

       }
    });
});
router.post("/get",function(req,res)
{
    let model = {};
    db.getDb(function(err,connection)
    {
        if (err)
            res.json({err: err});
        else
        {
            async.waterfall([
                (cb)=>{
                        orm.get((new EntryRecord()).getCollection(), req.body.id, function (err, entry) {
                            if (entry)
                                model.data = entry;
                            cb(err);
                        }, connection);
                },
                (cb)=>
                {
                    orm.find((new Project()).getCollection(),{$or:[{memberIds:{$in:[model.data.personId]}},{pmId:model.data.personId}],status:{ $ne : projectStatus.STATUS_END }},{createDate:1},(err,rs)=>{
                        if (err)cb(err);
                        let tasks=[];
                        rs.forEach((item,index)=>{
                            if ( !item.status || item.status!=projectStatus.STATUS_END)
                            {
                                tasks.push(item);
                            }
                        });
                        model.projs = tasks;
                        cb(null);
                    },connection);
                },
                (cb)=> {
                    orm.get((new Contract()).getCollection(), model.data.contractId.toString(), function (err, contract) {
                        if (contract)
                            model.contract = contract;
                        cb(err);
                    },connection)
                },
                (cb)=> {
                    orm.get((new Project()).getCollection(), model.data.projId.toString(), function (err, project) {
                        if (project) {
                            model.milestones = project.planedMilestones;
                            model.project = project;
                        }
                        cb(err);
                    },connection)
                },
                // (cb)=>{
                // orm.get((new Person().getCollection(),model.data.personId.toString(),function)
                //
                // }
                (cb)=> {
                    orm.find((new Person()).getCollection(), {}, null, function (err, persons) {
                        if (persons)
                            model.persons = persons;
                        else{
                            cb(err);
                        }
                    }, connection)
                }
            ],function (err)
            {
                try {
                    connection.close();
                } catch (e) {
                    logger.err(e);
                }
                if (err)
                    res.json({err: err});
                else
                {
                    res.json(model);
                }
            });
        }
    });

});
router.post("/save",function(req,res)
{
    let p = new EntryRecord();
    wb.mappingObj(req,req.body.record,p,orm.operTypes.INSERT);
    let m = timeutils.getWeekInfo()
    p.week = m.week;
    p.weekMonth = m.month;
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
/**
 * 58ce0bbe207a870a02449d3e
 * update record cash、completedMilestone、Desc
 */
router.post("/updateCash",function(req,res)
{
    let p = new EntryRecord();
    orm.get(p.getCollection(),req.body.record._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else {
            Object.assign(p, rs);
            p.cash = parseFloat(req.body.record.cash);
            if (req.body.record.completedMilestone)
                p.completedMilestone = req.body.record.completedMilestone;
            else
                p.completedMilestone = null;
            p.desc = req.body.record.desc;
            p.addr = req.body.record.addr;
            let entryDate = null;
            if (req.body.record.createDate)
            {
                p.createDate = moment(req.body.record.createDate,"DD/MM/YYYY HH:mm").unix();
                entryDate = moment(req.body.record.createDate,"DD/MM/YYYY HH:mm").toDate();
            }
            if (req.body.record.modifiedDate)
            {
                p.modifiedDate = moment(req.body.record.modifiedDate,"DD/MM/YYYY HH:mm").unix();
                entryDate = moment(req.body.record.modifiedDate,"DD/MM/YYYY HH:mm").toDate();
            }
            p.year = entryDate.getFullYear();
            p.month = entryDate.getMonth() + 1;
            p.day = entryDate.getDate();
            async.waterfall([
                (cb)=>{
                    if (req.body.record.completedMilestone) {
                        projectService.updateMilestone(p.projId,req.body.record.completedMilestone,function(err,rs)
                        {
                            cb(err,rs);
                        })
                    }
                    else {cb(null,new Project());}
                },
                (proj,cb)=>{
                        orm.update(p, req.body.record._id, function (err, rs) {
                            cb(err, rs);
                        });
                }
            ],function(err,entryrecord)
            {
                if (err)
                    res.json({err:err});
                else
                    res.json({data: entryrecord});
            });
        }
    });
});
router.post("/update",function(req,res)
{
    let p = new EntryRecord();
    orm.get(p.getCollection(),req.body.record._id,function(err,rs)
    {
        Object.assign(p, rs);
        p.cash = parseFloat(req.body.record.cash);
        let m = timeutils.getWeekInfo()
        p.week = m.week;
        p.weekMonth = m.month;
        orm.update(p,req.body.record._id,function(rs)
        {
            res.json({data:p});
        });

    });
});
router.post("/del",function(req,res)
{
    let p = new EntryRecord();
    orm.delById(p.getCollection(),req.body.record._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});


module.exports = router;

