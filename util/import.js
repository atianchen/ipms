/**
 * Created by jensen on 2017/2/15.
 */
const xlsx = require("node-xlsx");
const moment = require("moment");
const db = require("../db/db");
const async = require("async");
const encryutils = require("../util/encryptutils");
const timeutils = require('../util/timeutils');
const projectStatus = require('../db/constants').projectStatus;
const {Person,Contract,Project,EntryRecord} = require("../domain/model");
var depot = xlsx.parse("d:/eddywan.xlsx");// xlsx.parse("/Users/jensenchen/work/doc/ipms/reimport.xlsx");
db.initdb();
function updateEntryTaskId()
{
    db.getDb((err,conn)=>
    {
        let projMap = {};
        async.waterfall([
            (cb)=>{
                db.find("project",{},null,function(err,rs)
                {
                    if (err)
                    {
                        console.log("err:"+err);
                        cb(err);
                    }
                    else
                    {
                        rs.forEach(function(proj)
                        {
                            projMap[proj._id.toString()]=proj;
                        });
                        cb(null);
                    }
                },conn);
            },
            (cb)=>
            {
                db.find("entryrecord",{createDate:{"$gt":1490112000}},null,function(err,rs)
                {
                    cb(null,rs);
                },conn);
            },
            (rs,cb)=>
            {
                console.log("record length:"+rs.length);
                let len = rs.length;
                let loopCount = 0;
                async.whilst(
                    ()=>{return loopCount<len;},
                    (callback)=>{
                        rs.forEach((record)=>
                        {
                            if (projMap[record.projId.toString()])
                            {
                                let sysProj = projMap[record.projId.toString()].sysProj;
                                console.log(record.personName);
                               if (record.milestone && record.milestone.length>0) {
                                   db.update("entryrecord", {_id: record._id}, {$set: {taskId: sysProj+ "-" + record.milestone,sysProj:sysProj}}, (err, rs) => {
                                       loopCount++;
                                       callback();
                                   }, conn);
                               }
                               else
                               {
                                   db.update("entryrecord", {_id: record._id}, {$set: {taskId: sysProj + "-",sysProj:sysProj}}, (err, rs) => {
                                       loopCount++;
                                       callback();
                                   }, conn);
                               }
                            }
                            else
                            {
                                loopCount++;
                            }
                            console.log("----loopCount:"+loopCount);
                        });


                    },
                    (err)=>
                    {
                        cb(err);
                    }
                );
            }
        ],function(err)
        {
            conn.close();
            if (err)
                console.log(err);
        });
    });
}
/**
 * update project's division
 */
function updateProjDivision()
{
    db.getDb((err,conn)=>
    {
        async.waterfall([
            (cb)=>
            {
                db.find("contract",null,null,function(err,contracts)
                {
                    cb(null,contracts);
                },conn);
            },
            (cb,projs)=>
            {
                let len = contracts.length;
                let loopCount = 0;
                async.whilst(
                    ()=>{return loopCount<len;},
                    (callback)=>{
                        db.updateMany("project",{contractId:contracts[loopCount]},{$set:{division:contracts[loopCount].division}},(err,rs)=>{
                            loopCount++;
                            callback();
                        },conn);

                    },
                    (err)=>
                    {
                        cb(err);
                    }
                );
            }
        ],function(err)
        {
            conn.close();
            if (err)
                console.log(err);
        });
    });
}
/**
 * update entryRecord's division
 */
function updateRecordDivision()
{
    db.getDb(function(err,conn)
    {
        async.waterfall([
            (cb)=>
            {
                db.find("project",null,null,function(err,projs)
                {
                    cb(null,projs);
                },conn);
            },
            (cb,projs)=>
            {
                let len = projs.length;
                let loopCount = 0;
                async.whilst(
                    ()=>{return loopCount<len;},
                    (callback)=>{
                        db.updateMany("entryrecord",{projId:projs[loopCount]},{$set:{division:projs[loopCount].division}},(err,rs)=>{
                            loopCount++;
                            callback();
                        },conn);

                    },
                    (err)=>
                    {
                       cb(err);
                    }
                );
            }
        ],function(err)
        {
            conn.close();
           if (err)
               console.log(err);
        });
    });
}
function updateSysProjId()
{
    db.getDb(function(err,connection)
    {
        db.find("project",{},null,function(err,rs)
        {
            let loopCount = rs.length;
            let count = 0;
            async.whilst(
                function() { return count<loopCount},
                function(cb) {
                    rs.forEach(function(p)
                    {

                        if (p.completedMilestone==null  || p.completedMilestone.trim().length <1)
                            if (p.planedMilestones && p.planedMilestones.length>0)
                            {
                                p.currentMilestone = p.planedMilestones[0];
                            }
                        else　　
                            {
                                for (let i=0;i<p.planedMilestones.length;i++)
                                {
                                    if (p.completedMilestone==p.planedMilestones[i])
                                    {
                                        if (i<(p.planedMilestones.length-1))
                                        {
                                            p.currentMilestone = p.planedMilestones[i+1];
                                        }
                                        break;
                                    }
                                }
                            }

                        if (p.currentMilestone && p.currentMilestone.trim().length > 0) {
                            p.taskId = p.type + "-" + p.projectId+ "-" + p.currentMilestone;
                        }
                        else {
                            p.taskId =   p.type + "-" + p.projectId+"-";//+ "-" + p.currentMilestone;
                        }
                        console.log(p.taskId);
                        p.sysProj =   p.type + "-" + p.projectId;
                        db.update("project",{_id:p._id},p,function(err,ps)
                        {
                            if (err)
                                cb(err);
                            count++;
                        },connection)
                    });
                },
                function(err) {
                    console.log("update successful!");
                    connection.close();
                }
            );
        },connection);
    });
}

function importContract(data)
{
    let createTime = moment().unix();
    db.getDb(function(err,connection)
    {
        try
        {
            if (err) {
                console.log("err:"+err);
                connection.close();
            }
            else
            {
                db.find("contract",{},null,function(err,rs)
                {
                    let cm = {};
                    rs.forEach(function(c)
                    {
                        cm[c.contractId.trim()]=c;
                    });
                    let contracts = [];
                    let index = 0;
                    data.forEach(function(item) {
                        if (index>0 && typeof(item[0]) != "undefined") {

                            let contract = new Contract();
                            contract.contractId = item[0].toString().trim();
                            if (!cm[contract.contractId])
                            {
                                contract.signedYear = parseInt(item[1]);
                                contract.salesMan = item[2];
                                contract.productLine = item[3];
                                contract.customerName = item[4];
                                contract.customerAbbr = item[5];
                                contract.createDate = createTime;
                                contract.currency = item[6].toString().toUpperCase();
                                contract.amt = parseFloat(item[7]).toFixed(2);
                                if (item[8] && item[8].toString().trim().length > 0) {
                                    contract.imp = parseFloat(item[8].toString()).toFixed(2) * 100;
                                }
                                else
                                    contract.imp = 0;
                                contract.cashInOpen = parseFloat(item[9]).toFixed(2);
                                if (item[10] && item[10].toString().trim().length > 0) {
                                    contract.processOpen = parseFloat(item[10].toString()).toFixed(2) * 100;
                                }
                                else
                                    contract.processOpen = 0;
                                contracts.push(contract);
                             }
                        }
                        index++;
                    });
                    if (contracts.length>0) {
                        db.insert("contract", contracts, function (err, rs) {
                            if (err)
                                console.log("err:" + err);
                            else
                                console.log("contract insert successful");
                            connection.close();
                        }, connection);
                    }
                    else
                    {
                        connection.close();
                    }
                },connection);

            }
        }
        catch (e)
        {
            console.log("err:"+e);
            connection.close();
        }
    });
}
function importPerson(data)
{
    let createTime = moment().unix();
    let pwd = encryutils.md5("88888888");
    db.getDb(function(err,connection)
    {
        try
        {
            db.find("position", {}, null, function (err, ps) {
                if (err) {
                   connection.close();
                }
                else {
                    let psMap = {};
                    ps.forEach(function(pos)
                    {
                        psMap[pos.code.trim()]=pos;
                    });
                    let persons = [];
                    let index = 0;
                    data.forEach(function(item)
                    {
                        if (index>1) {
                            let p = new Person();
                            p.userId = item[0].toString().trim();
                            p.name = item[1];
                            p.positionId = psMap[item[2].trim()]._id;
                            p.role = item[3];
                            p.mobile = item[4];
                            p.email = item[5];
                            p.pwd = pwd;
                            p.createDate = createTime;
                            persons.push(p);
                        }
                        index++;
                    });
                    //connection.close();
                   db.insert("person",persons,function(err,rs){
                        if (err)
                            console.log("err:"+err);
                        else
                            console.log("person insert successful");
                        connection.close();
                    },connection);
                }
            }, connection)

        }
        catch (e)
        {
            console.log("err:"+e);
            if (connection)
                connection.close();
        }

    });
}


function importProject(data)
{
    let createTime = moment().unix();
    db.getDb(function(err,connection)
    {
        if (err) {
            console.log("err:"+err);
            connection.close();
        }
        else
        {
            let depot = {};
            async.waterfall([
                (cb)=>{
                    db.find("person",{},null,function(err,rs)
                    {
                        if (err)
                        {
                            cb(err);
                        }
                        else
                        {
                            let personMap = {};
                            rs.forEach(function(person)
                            {
                                personMap[person.userId]=person;
                            });
                            depot.persons = personMap;
                            cb(null);
                        }
                    },connection);
                },
                (cb)=>{
                    db.find("contract",{},null,function(err,rs)
                    {
                        if (err)
                        {
                            cb(err);
                        }
                        else
                        {
                            let contractMap = {};
                            rs.forEach(function(contract)
                            {
                                contractMap[contract.contractId]=contract;
                            });
                            depot.contracts = contractMap;
                            cb(null);
                        }
                    },connection);
                },
                (cb)=>
                {
                    let projs = [];
                    let index = 0;

                    db.find("project",{},null,function(err,rs)
                    {
                        let ps = {};
                        rs.forEach(function(p)
                        {
                            ps[p.projectId.trim()]=p;
                        });
                        data.forEach(function(item) {
                            if (index>0 && depot.contracts[item[0].toString().trim()]) {
                                let proj = new Project();
                                proj.contractId = depot.contracts[item[0].toString().trim()]._id;
                                proj.name = item[1];
                                proj.projectId = depot.contracts[item[0].toString().trim()].customerAbbr + "-" + proj.name;
                                if (!ps[proj.projectId])
                                {
                                    if (typeof(item[2]) != "undefined" && item[2].toString().length > 0) {
                                        proj.planedMilestones = [];
                                        item[2].toString().split("/").forEach(function (m) {
                                            proj.planedMilestones.push(m);
                                        });
                                        proj.currentMilestone = proj.planedMilestones[0];
                                    }
                                    else {
                                        proj.progress = 0;
                                    }
                                    if (depot.persons[item[3].toString().trim()])
                                        proj.pmId = depot.persons[item[3].toString().trim()]._id;
                                    proj.memberIds = [];
                                    for (let i = 4; i <= 8; i++) {
                                        if (typeof (item[i]) != "undefined" && item[i].toString().length > 0 && depot.persons[item[i].toString().trim()]) {
                                            proj.memberIds.push(depot.persons[item[i].toString().trim()]._id);
                                        }
                                    }
                                    proj.type = "Imp";
                                    proj.sysProj = proj.type + "-" + proj.projectId;//+ "-" + p.currentMilestone;
                                    proj.status = projectStatus.STATUS_PROCESS;
                                    proj.createDate = createTime;
                                    projs.push(proj);
                                }
                                else
                                {
                                    console.log("skip project "+proj.projectId);
                                }
                            }
                            else
                            {
                                console.log("must found contrat:"+item[0].toString().trim());
                            }
                            index++;
                        });
                        db.insert("project",projs,function(err,rs){
                            if (err)
                                console.log("err:"+err);
                            else
                                console.log("project insert successful");
                            connection.close();
                        },connection);
                    },connection);


                }

            ],function(err)
            {
                connection.close();
            });
        }
    });
}
function importEntryRecord(data)
{
    let persons = {};
    db.getDb(function(err,connection) {
            async.waterfall([
                (cb)=>{
                    db.find("person",{},null,function(err,rs)
                    {
                        if (err)
                        {
                            cb(err);
                        }
                        else
                        {
                            let personMap = {};
                            rs.forEach(function(person)
                            {
                                personMap[person.userId]=person;
                            });
                            depot.persons = personMap;
                            cb(null);
                        }
                    },connection);
                },
                (cb)=>{
                    db.find("project",{},null,function(err,rs)
                    {
                        if (err)
                        {
                            cb(err);
                        }
                        else
                        {
                            let projMap = {};
                            rs.forEach(function(proj)
                            {
                                projMap[proj.projectId]=proj;
                                projMap[proj.type+"-"+proj.projectId]=proj;
                            });
                            depot.projs = projMap;
                            cb(null);
                        }
                    },connection);
                },
                (cb)=>
                {
                    let beginDate,endDate;
                    let index = 0;
                    let records = [];
                    data.forEach(function(item)
                    {
                        if (index>0) {
                            if (item[0] && item[0].toString().length>0) {
                                let usr = depot.persons[item[0].toString().trim()];
                                let er = new EntryRecord();
                                let proj = depot.projs[getProjId(item[3].toString())];
                                if (proj) {
                                    beginDate = moment(item[8].toString(), "DD/MM/YYYY HH:mm");
                                    if (item[9] && item[9].toString().length > 0)
                                        endDate = moment(item[9].toString(), "DD/MM/YYYY HH:mm");
                                    else
                                        endDate = null;
                                    let m = timeutils.getWeekInfo(beginDate.toDate());
                                    er.taskId = item[3];
                                    er.year = beginDate.toDate().getFullYear();
                                    er.month = beginDate.toDate().getMonth() + 1;
                                    er.day = beginDate.toDate().getDate();
                                    er.division = usr.division;
                                    er.sysProj = proj.sysProj;
                                    er.period = item[5].toString();
                                    if (item[6] && item[6].toString().length > 0)
                                        er.cash = parseFloat(item[6].toString());
                                    if (item[4] && item[4].toString().length > 0)
                                        er.addr = item[4].toString();
                                    else
                                        er.addr = "";
                                    er.milestone = getMilestone(item[3].toString());
                                    er.week = m.week;
                                    if (item[7] && item[7].toString().length > 0)
                                        er.completedMilestone = item[7].toString();
                                    er.groupName = usr.groupName;
                                    er.weekMonth = m.month;
                                    er.type = proj.type;
                                    er.contractId = proj.contractId;
                                    er.projId = proj._id;
                                    er.person = usr.userId;
                                    er.personName = usr.name;
                                    er.personId = usr._id;
                                    er.createDate = beginDate.unix();
                                    if (endDate)
                                        er.modifiedDate = endDate.unix();
                                    er.flag = "20170420";
                                    records.push(er);
                                    //if (er.cash)
                                    // console.log(er);
                                }
                                else
                                {
                                    console.log("skip project index("+index+") :"+getProjId(item[3].toString()));
                                }
                            }
                        }
                        index++;
                    });
                    db.insert("entryrecord",records,function(err,rs){
                        cb(null);
                    },connection);

                }

            ],function(err)
            {
                console.log("---import finish----");
                connection.close();
            });
    })
}
function getProjId(taskId)
{
    if (taskId.indexOf("Pre-Sales")==0) {
            return taskId.substring(10, taskId.lastIndexOf("-"));
    }
    else if (taskId.indexOf("SUPP")>0)
    {
        return taskId.substring(taskId.indexOf("-")+1);
    }
    else {
        if (taskId.indexOf("-MM-")>0) {
            return taskId.substring(taskId.indexOf("-") + 1, taskId.lastIndexOf("-MM-"));
        }
        else
        {
            return taskId.substring(taskId.indexOf("-") + 1, taskId.lastIndexOf("-"));
        }
    }
}
function getMilestone(taskId)
{
    if (taskId.indexOf("-MM-")>0) {
        return taskId.substring(taskId.indexOf("-MM-")+1);
    }else{
        let index = taskId.lastIndexOf("-");
        if (index < taskId.length - 1)
            return taskId.substring(index + 1);
        else
            return null;
    }
}

/*taskId:{type:STRING},
year:{type:INT},
month:{type:INT},
day:{type:INT},
division:{type:STRING},
sysProj:{type:STRING},
period:{type:STRING},
cash:{type:DOUBLE},
addr:{type:STRING},
milestone:{type:STRING},
week:{type:INT},
completedMilestone:{type:STRING},
groupName:{type:STRING,len:200},
weekMonth:{type:INT},
type:{type:STRING},
desc:{type:STRING},
contractId:{type:REF,join:{col:'contract'},alias:"contract"},
projId:{type:REF,join:{col:'project'},alias:"project"},
person:{type:STRING},
personName:{type:STRING},
personId:{type:REF,join:{col:'person'},alias:"person"},
createDate:{type:DATE,format:"DD/MM/YYYY"},
createUser:{type:INT},
modifiedUser:{type:INT},
modifiedDate:{type:DATE,format:"DD/MM/YYYY"}*/
//importPerson(depot[0].data);
//importContract(depot[2].data);
//importProject(depot[3].data);
//updateSysProjId();
//console.log(depot);
//updateProjDivision();
//updateRecordDivision();
importEntryRecord(depot[0].data);
//importEntryRecord(depot[1].data);
//updateEntryTaskId();
