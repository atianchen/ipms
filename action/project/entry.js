/**
 * Punch Record
 * Created by jensen on 2017/1/24.
 */
const express = require('express');
const router = express.Router();
const db = require('../../db/db');
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const moment = require('moment');
const {ObjectId} = require('mongodb');
const async = require('async');
const timeutil = require('../../util/timeutils');
const bots  = require('../../slack/bots');
const {Project,Person,EntryRecord} = require('../../domain/model');
const logger = require("../../util/logger").log;
const geoutils  = require('../../util/geoutils');
const timeutils = require('../../util/timeutils');
const projectService = require('../../service/projectService');
const projectStatus = require('../../db/constants').projectStatus;
router.get("/attendance",function(req,res)
{
    res.render("attendance",{u:req.query.user,channel:req.query.channel});
});

router.post("/loadUpeEntryData",function(req,res)
{
    let u = req.body.user;
    let model = {};
    db.getDb(function(err,connection)
    {
        if (err)
        {
            model.err = err;
        }
        else
        {
            async.waterfall([
                (cb)=>{
                    /**
                     * find user by upe's memberId
                     */
                    orm.find((new Person()).getCollection(),{upeMemberId:u},null,(err,rs)=>{
                        if (err)cb(err);
                        if (rs.length<1)
                            cb(new Error("User not found"));
                        else
                            cb(null,rs[0]);
                    },connection);
                },
                (person,cb)=>{
                    model.person = person;
                    /**
                     * get User's Project
                     */
                    orm.find((new Project()).getCollection(),{$or:[{memberIds:{$in:[person._id]}},{pmId:person._id}],status:{ $ne : projectStatus.STATUS_END }},{createDate:1},(err,rs)=>{
                        if (err)cb(err);
                        let tasks=[];
                        rs.forEach((item,index)=>{
                             if ( !item.status || item.status!=projectStatus.STATUS_END)
                             {
                            tasks.push(item);
                            }
                        });
                        model.tasks = tasks;
                        cb(null);
                    },connection);
                }
            ], function (err) {
                try { connection.close(); } catch (e){logger.err(e);}
                if (err) model.err = err;
                model.nowTime = moment().format("dddd, MMMM Do YYYY, h:mm");
                model.hours = moment().hours();
                model.quantum = timeutil.quantum();
                res.json(model);
            });
        }
    });
});
/**
 * punch ui
 */
router.post("/loadEntryData",function(req,res)
{
    let u = req.body.user;
    let model = {};
    db.getDb(function(err,connection)
    {
        if (err)
        {
            model.err = err;
        }
        else
        {
            async.waterfall([
                (cb)=>{
                    /**
                     * find user by slack's userId
                     */
                    orm.find((new Person()).getCollection(),{slack:u},null,(err,rs)=>{
                        if (err)cb(err);
                        if (rs.length<1)
                            cb(new Error("User not found"));
                        else
                            cb(null,rs[0]);
                    },connection);
                },
                (person,cb)=>{
                    model.person = person;
                    /**
                     * get User's Project
                     */
                    orm.find((new Project()).getCollection(),{$or:[{memberIds:{$in:[person._id]}},{pmId:person._id}],status:{ $ne : projectStatus.STATUS_END }},{createDate:1},(err,rs)=>{
                        if (err)cb(err);
                        let tasks=[];
                        rs.forEach((item,index)=>{
                           // if ( !item.completedMilestone  || !item.status || item.status!=projectStatus.STATUS_END)
                           // {
                                tasks.push(item);
                            //}
                        });

                        model.tasks = tasks;
                        cb(null);
                    },connection);
                }
            ], function (err) {
                try { connection.close(); } catch (e){logger.err(e);}
                if (err) model.err = err;
                model.nowTime = moment().format("dddd, MMMM Do YYYY, h:mm");
                model.hours = moment().hours();
                model.quantum = timeutil.quantum();
                res.json(model);
            });
        }
    });
});
router.post("/updateEntry",function(req,res)
{
    let data = {};
    Object.assign(data,req.body.record);
    db.getDb(function(err,connection)
    {
        async.waterfall([
            (cb)=> {
                db.find("person",{$or:[{userId:data.person},{email:data.person}]},null,function(err,rs)
                {
                    if (err || rs.length<1)
                        cb(new Error("User Not Found"));
                    else
                    {
                        data.person = rs[0];
                        cb(null);
                    }
                },connection);
            },
            (cb)=> {
                db.find("project",{sysProj:data.sysProj},null,function(err,rs)
                {
                    if (err || rs.length<1)
                        cb(new Error("Task Not Found"));
                    else
                    {
                        data.projId = rs[0]._id;
                        // data.taskId = rs[0]._id.toString();
                        if (data.milestone)
                            data.taskId = rs[0].type+ "-" + rs[0].projectId+ "-" + data.milestone;
                        else
                            data.taskId = rs[0].type+ "-" + rs[0].projectId;
                        cb(null);
                    }
                },connection);
            }
        ],function(err){
            if (connection)
                connection.close();
            saveEntry(data,{manual:true,disableUpdate:true,entryDate:moment(req.body.record.createDate,"DD/MM/YYYY HH:mm").toDate(),punchTime:moment(req.body.record.createDate,"DD/MM/YYYY HH:mm").unix()
                        ,punchTime2:(req.body.record.modifiedDate&&req.body.record.modifiedDate.trim().length>0)?moment(req.body.record.modifiedDate,"DD/MM/YYYY HH:mm").unix():null},function(err,entry)
            {
                if (err) {
                    res.json({err: err});
                }
                else {
                    res.json({entry: entry});
                }
            });
        });
    });
});
router.post("/manualAddEntry",function(req,res)
{
    let data = {};
    Object.assign(data,req.body.record);
    db.getDb(function(err,connection)
    {
        async.waterfall([
            (cb)=> {
                db.find("person",{$or:[{userId:data.person},{email:data.person}]},null,function(err,rs)
                {
                    if (err || rs.length<1)
                        cb(new Error("User Not Found"));
                    else
                    {
                        data.person = rs[0];
                        cb(null);
                    }
                },connection);
            },
            (cb)=> {
                db.find("project",{sysProj:data.sysProj},null,function(err,rs)
                {
                    if (err || rs.length<1)
                        cb(new Error("Task Not Found"));
                    else
                    {
                        data.projId = rs[0]._id;
                       // data.taskId = rs[0]._id.toString();
                        if (data.milestone)
                            data.taskId = rs[0].type+ "-" + rs[0].projectId+ "-" + data.milestone;
                        else
                            data.taskId = rs[0].type+ "-" + rs[0].projectId;
                        cb(null);
                    }
                },connection);
            }
        ],function(err){
            if (connection)
                connection.close();
            saveEntry(data,{manual:true,disableUpdate:true,entryDate:moment(req.body.record.entryDate,"DD/MM/YYYY HH:mm").toDate(),punchTime:moment(req.body.record.entryDate,"DD/MM/YYYY HH:mm").unix()},function(err,entry)
            {
                if (err) {
                    res.json({err: err});
                }
                else {
                    res.json({entry: entry});
                }
            });
        });
    });
});
router.post("/addEntry",function(req,res)
{
    let data = {};
    Object.assign(data,req.body);
    db.getDb(function(err,connection)
    {
        async.waterfall([
            (cb)=> {
                db.find("person",{$or:[{userId:data.person},{email:data.person}]},null,function(err,rs)
                {
                    if (err || rs.length<1)
                        cb("User Not Found");
                    else
                    {
                        data.person = rs[0];
                        cb(null);
                    }
                },connection);
            },
            (cb)=> {
                db.find("project",{sysProj:data.sysProj},null,function(err,rs)
                {
                    if (err || rs.length<1)
                        cb("Task Not Found");
                    else
                    {
                        data.taskId = rs[0]._id.toString();
                    }
                },connection);
            }
        ],function(err){
            if (connection)
             connection.close();
            saveEntry(data,{entryDate:moment(req.body.entryDate).toDate()},function(err,entry)
            {
                if (err) {
                    res.json({err: err});
                }
                else {
                    res.json({entry: entry});
                }
            });
        });
    });

});
/**
 * punch
 */
router.post("/submitEntry",function(req,res)
{
   saveEntry(req.body,{},function(err,entry)
   {
       if (err) {
           res.json({err: err});
       }
       else {
           res.json({entry: entry});
       }
   });
});
function saveEntry(data,opt,callback)
{
    let userId = data.user;
    let nt = new Date();
    let project = null;
    let entry = new EntryRecord();
    if (data._id)
        entry._id = new ObjectId(data._id);
    entry.period = data.period;
    if (opt && opt.entryDate) {
        entry.year = opt.entryDate.getFullYear();
        entry.month = opt.entryDate.getMonth() + 1;
        entry.day = opt.entryDate.getDate();
    }
    else
    {
        entry.year = nt.getFullYear();
        entry.month = nt.getMonth() + 1;
        entry.day = nt.getDate();
    }
    if (data.coord) {
        entry.coordinates = data.coord;
    }
    if (data.completedMilestone)
        entry.completedMilestone = data.completedMilestone;
    if (data.cash && data.cash.trim().length>0)
        entry.cash = parseFloat(data.cash);
    if (data.addr)
        entry.addr = data.addr;
    entry.desc = data.desc;
    db.getDb(function(err,connection)
    {
        if (err)
        {
            model.err = err;
        }
        else
        {
            async.waterfall([

                (cb)=>{
                    if (data.person) {
                        cb(null, data.person);
                    }
                    else
                    {
                        /**
                         * step 1 :get user's info
                         */
                        orm.find((new Person()).getCollection(), {_id:new ObjectId(data.user)}, null, (err, rs) => {
                            if (err) cb(err);
                            if (rs.length < 1)
                                cb(new Error("User not found"));
                            else
                                cb(null, rs[0]);
                        }, connection);
                    }
                },
                (person,cb)=>{
                    entry.person = person.userId;
                    entry.personName = person.name;
                    entry.personId = person._id;
                    entry.groupName = person.groupName;
                    /**
                     * step 2: get project that user chooose
                     */
                    if (opt.manual)
                    {
                        orm.find((new Project()).getCollection(), {_id: data.projId}, {createDate: 1}, (err, rs) => {
                            if (err) cb(err);
                            if (rs.length < 1)
                                cb(new Error("Project not found"));
                            else {
                                person.lastProjId = rs[0]._id;
                                project = rs[0];
                                entry.projId = rs[0]._id;
                                entry.sysProj = rs[0].sysProj;
                                entry.type = rs[0].type;
                                entry.contractId = rs[0].contractId;
                                entry.division = rs[0].division;
                                entry.taskId = data.taskId;
                                entry.milestone = data.milestone;
                                cb(null, person, rs[0]);
                            }
                        }, connection);
                    }
                    else
                    {
                        if (data.taskId && data.taskId.toString().length>0) {
                            orm.find((new Project()).getCollection(), {_id: new ObjectId(data.taskId)}, {createDate: 1}, (err, rs) => {
                                if (err) cb(err);
                                if (rs.length < 1)
                                    cb(new Error("Project not found"));
                                else {
                                    person.lastProjId = rs[0]._id;
                                    project = rs[0];
                                    entry.projId = rs[0]._id;
                                    entry.sysProj = rs[0].sysProj;
                                    entry.taskId = rs[0].taskId;
                                    entry.type = rs[0].type;
                                    entry.contractId = rs[0].contractId;
                                    entry.division = rs[0].division;
                                    if (rs[0].currentMilestone)
                                        entry.milestone = rs[0].currentMilestone;

                                    cb(null, person, rs[0]);
                                }
                            }, connection);
                        }
                    }
                },
                (person,project,cb)=>
                {
                    if (opt.punchTime)
                        cb(null,person,project);
                    else {
                        connection.collection('entryrecord').aggregate(
                            [
                                {
                                    $match: {
                                        personId: entry.personId,
                                        projId: project._id,
                                        year: entry.year,
                                        month: entry.month,
                                        day: entry.day
                                    }
                                },
                                {
                                    $group: {
                                        "_id": "personId",
                                        createDate: {$max: "$createDate"},
                                        modifiedDate: {$max: "$modifiedDate"},
                                    }
                                }
                            ]).toArray(function (err, result) {
                            if (err)
                                cb(err);
                            else {
                                if (result && result.length > 0) {
                                    let lastpt = null;
                                    if (result[0].createDate)
                                        lastpt = result[0].createDate;
                                    if (result[0].modifiedDate
                                    && 　(lastpt==null || lastpt<result[0].modifiedDate))
                                    {
                                        lastpt = result[0].modifiedDate;
                                    }
                                    if (lastpt!=null && (moment().unix()*1000-lastpt*1000)<1000*60*60)
                                    {
                                        cb("Within an hour, only one check is allowed");
                                    }
                                    else
                                        cb(null,person,project);
                                }
                                else {
                                    cb(null,person,project);
                                }
                            }
                        });
                    }
                },
                (person,project,cb)=>
                {
                    /**
                     * update person last TaskId
                     */
                    db.update("person",{_id:person._id},person,function(err,rs)
                    {
                        if (err)
                            cb(err)
                        else
                            cb(null, project);
                    },connection);
                },
                /**
                 *  punch interval must more tha one hour
                 * @param cb
                 */
                (project,cb)=>
                {
                    if (data.completedMilestone  && data.completedMilestone.trim().length>0
                    &&  typeof(opt.disableUpdate)=="undefined") {
                        /**
                         * if set completedMilestone,update project status
                         */
                        projectService.updateMilestone(entry.projId.toString(),data.completedMilestone,function(err,rs)
                        {
                            cb(err,project);
                        })
                    }
                    else {
                        orm.get("project",entry.projId.toString(),function(err,rs)
                        {
                            cb(err,rs);
                        },connection)

                    }
                },
                /**
                 * last step :save punch info
                 * @param project
                 * @param cb
                 */
                (project,cb)=>{

                    if (entry._id)
                        cb(null);
                    else if (project._id) {
                        orm.find(entry.getCollection(), {
                            personId: entry.personId,
                            projId: project._id,
                            year: entry.year,
                            month: entry.month,
                            day: entry.day,
                            period: entry.period
                        }, null, (err, rs) => {
                            if (rs.length > 0) {
                                entry._id = rs[0]._id;
                                entry.createDate = rs[0].createDate;
                            }
                            cb(err);
                        }, connection);
                    }
                    else {cb(null);}
                }
            ], function (err) {
                try { connection.close(); } catch (e){logger.err(e);}
                if (err)
                   callback(err);// res.json({err:err});
                else {

                    let m = timeutils.getWeekInfo()
                    entry.week = m.week;
                    entry.weekMonth = m.month;
                    if (entry.coordinates)
                    {
                        geoutils.geoquerygoogle(entry.coordinates,function(err,addr)
                        {
                            entry.addr = addr;
                            if (entry._id) {
                                if (opt.punchTime)
                                    entry.modifiedDate = opt.punchTime;
                                else
                                    entry.modifiedDate=moment().unix();
                                orm.update(entry, entry._id, function (err, rs) {
                                   // res.json({entry: entry});
                                    callback(null,entry);
                                });
                            }
                            else {
                                if (opt.punchTime)
                                    entry.createDate = opt.punchTime;
                                else
                                     entry.createDate=moment().unix();
                              //  entry.modifiedDate=entry.createDate;
                                orm.insert(entry, function (err, rs) {
                                   // res.json({entry: entry});
                                    callback(null,entry);
                                });
                            }
                            chatNotify(entry,data.channel,project);
                        });
                    }
                    else
                    {
                        if (entry._id) {
                            if (opt.punchTime)
                                entry.createDate = opt.punchTime;
                            if (opt.punchTime2)
                                entry.modifiedDate = opt.punchTime2;
                            else {
                                if (typeof(opt.manual) == "undefined")
                                    entry.modifiedDate = moment().unix();
                                else
                                    entry.modifiedDate  = null;
                            }
                            orm.update(entry, entry._id, function (err, rs) {
                               // res.json({entry: entry});
                                callback(null,entry);
                            });
                        }
                        else {
                            if (opt.punchTime)
                                entry.createDate = opt.punchTime;
                            else
                                entry.createDate=moment().unix();
                            //entry.modifiedDate=entry.createDate;
                            orm.insert(entry, function (err, rs) {
                                callback(null,entry);
                                //res.json({entry: entry});
                            });
                        }
                        if (data.channel) {
                            chatNotify(entry, data.channel, project);
                        }
                    }
                }
            });
        }
    });
}
function chatNotify(entry,channel,project)
{
    let msg = {
        "attachments": [
            {
                "fallback": "Entry Info",
                "color": "#36a64f",
                "title": "Entry Info",
                "fields": [
                    {
                        "title": "Task",
                        "value": project.sysProj,
                        "short": false
                    },
                    {
                        "title": "Addr",
                        "value": entry.addr,
                        "short": false
                    },
                    {
                        "title": "Desc",
                        "value": entry.desc,
                        "short": false
                    },
                    {
                        "title": "Period",
                        "value": entry.period,
                        "short": true
                    },
                    {
                        "title": "Time",
                        "value": (entry.modifiedDate)?moment(entry.modifiedDate*1000).format("DD/MM/YYYY, h:mm:ss"):moment(entry.createDate*1000).format("DD/MM/YYYY, h:mm:ss"),
                        "short": true
                    }

                ]
            }
        ]
    };
    if (channel) {
        try {
            bots.getBot().sendMsg(channel, msg);
        }
        catch (e)
        {
            console.log(e);
        }
    }
}
module.exports = router;