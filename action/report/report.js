/**
 * Created by jensen on 2017/2/6.
 */
const express = require('express');
const router = express.Router();
const moment = require('moment')
const db = require('../../db/db');
const wb = require('../../util/webutils');
const async = require('async');
const logger = require("../../util/logger").log;
const arrayutil = require("../../util/arrayutils");
const timeutil = require("../../util/timeutils");
router.post("/milestoneRpt",function(req,res)
{
    let years =[];
    let cache = {};
    let year = parseInt(req.body.year);


    let st = moment();
    st.year(year).month(0).dayOfYear(1).hour(0).minute(0).second(0);
    let et = moment(st);
    et.add(1, 'y');

    let endYear = moment().year();
    for (let y=endYear-3;y<=endYear;y++)
    {
        years.push(y);
    }
    db.getDb(function(err,connection)
    {
        if (err)
        {
            res.json({err:err});
        }
        else {
            async.waterfall([
                (cb) => {
                    db.find("milestonetype", {}, {createDate:1}, function (err, rs) {
                        if (err)
                            cb(err);
                        else {
                            cache.milestoneTypes = rs;
                            cb(null);
                        }
                    }, connection);
                },
                /**
                 * get all milestone
                 * @param cb
                 */
                    (cb) => {
                    let mt = null;
                    if (req.body.milestoneType)
                        mt = req.body.milestoneType;
                    else
                        mt = cache.milestoneTypes[0].name;
                    cache.mt = mt;
                    db.find("milestone", {type:mt}, {seq:1}, function (err, rs) {
                        if (err)
                            cb(err);
                        else {
                            cache.milestones = rs;
                            cache.milestoneNames = [];
                            cache.milestones.forEach(function(m)
                            {
                                cache.milestoneNames.push(m.name);
                            });
                            cb(null);
                        }
                    }, connection);
                },
                /**
                 * get project in spec year
                 * @param cb
                 */
                    (cb) => {
                    db.find("project", {type:cache.mt}, {"createDate": 1}, function (err, rs) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            cache.projects = rs;
                            cache.projIds = cache.projects.map(x=>x._id);
                            cb(null);
                        }
                    }, connection)
                },

                /**
                 * get contract's Id in spec year
                 * @param cb
                 */
                    (cb) => {
                    db.distinct("project", "contractId", {type:cache.mt}, function (err, rs) {
                        if (err)
                            cb(err);
                        else {
                            cache.contractIds = rs;
                            cb(null);
                        }
                    }, connection);
                },


                /**
                 * get contract's pmId in spec year
                 * @param cb
                 */
                    (cb) => {
                    db.distinct("project", "pmId", {type:cache.mt}, function (err, rs) {
                        if (err)
                            cb(err);
                        else {
                            cache.pmIds = rs;
                            cb(null);
                        }
                    }, connection);
                },
                /**
                 * get pm info x
                 * @param cb
                 */
                    (cb) => {
                    db.find("person", {"_id": {$in: cache.pmIds}}, {"modifiedDate": 1}, function (err, rs) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            cache.pms = rs;
                            cb(null);
                        }
                    }, connection)
                },

                /**
                 * get contract that relation projects in cache
                 * @param cb
                 */
                    (cb) => {
                    db.find("contract", {"_id": {$in: cache.contractIds}}, {"modifiedDate": 1}, function (err, rs) {
                        if (err) {
                            cb(err);
                        }
                        else {
                            cache.contracts = rs;
                            cb(null);
                        }
                    }, connection)
                },
                /**
                 * group by entryrecord  by milestone
                 * @param cb
                 */
                (cb) => {
                    connection.collection('entryrecord').aggregate(
                        [
                            {$match: {projId:{$in:cache.projIds},$or:[{"modifiedDate": {"$gte": st.unix(), "$lte": et.unix()}},{"createDate": {"$gte": st.unix(), "$lte": et.unix()}}]}},
                            {$sort: {"projId": 1, "milestone": 1}},
                            {$group: {"_id": {projId: "$projId", milestone: "$milestone"}, "count": {$sum: 1}}}
                        ]).toArray(function (err, result) {
                        if (err)
                            cb(err);
                        else {
                            cache.milestoneRs = result;
                            cb(null);
                        }
                    });
                },
                /**
                 * group by entryrecord  by week and weekmonth
                 * @param cb
                 */
                    (cb) => {

                   /* connection.collection('entryrecord').aggregate(
                        [
                            {$match: {milestone:{"$in": cache.milestoneNames},"modifiedDate": {"$gte": st.unix(), "$lte": et.unix()}}},
                            {$sort: {"projId": 1, "weekMonth": 1}},
                            {
                                $group: {
                                   // "_id": {projId: "$projId", weekMonth: "$weekMonth", week: "$week"},
                                    "_id": {projId: "$projId", weekMonth: "$weekMonth"},
                                    "count": {$sum: 1}
                                }
                            }
                        ]).toArray(function (err, result) {
                        if (err)
                            cb(err);
                        else {
                            cache.periodRs = result;
                            cb(null);
                        }
                    });*/
                    /**
                     * get complemilestone
                     */
                    connection.collection('entryrecord').aggregate(
                        [
                            {$match: {completedMilestone:{$ne:null},milestone:{"$in": cache.milestoneNames}}},
                            {$sort: {"projId": 1, "weekMonth": 1}},
                            {
                                $group: {
                                    // "_id": {projId: "$projId", weekMonth: "$weekMonth", week: "$week"},
                                    "_id": {projId: "$projId", weekMonth: "$weekMonth",milestone:"$completedMilestone"},
                                    "count": {$sum: 1}
                                }
                            }
                        ]).toArray(function (err, result) {
                        if (err)
                            cb(err);
                        else {
                            cache.periodRs = result;
                            cb(null);
                        }
                    });
                },
            ], function (err) {
                try {
                    connection.close();
                } catch (e) {
                    logger.err(e);
                }
                if (err)
                    res.json({err: err});
                else {
                    try
                    {
                        let result = analyze(cache);
                        result.milestoneTypes = cache.milestoneTypes;
                        result.years = years;
                        result.year = year;
                        result.milestoneType = cache.mt;
                        res.json(result);
                    }
                    catch (e)
                    {
                        console.log(e);
                        res.json({err: e});
                    }
                }
            });
        }
    });
});
class ChartVO
{

}
function analyze(depot)
{
    /**
     * get contract map that key is contract's id
     */
    let contractMap = arrayutil.convertToMap(depot.contracts,"_id");
    /**
     * get map of projectmanager that key is person's id
     */
    let pmMap = arrayutil.convertToMap(depot.pms,"_id");
    /**
     * classfiy milestone  aggregate result by projId and milestone
     */
    let pm = {};
    depot.milestoneRs.forEach(function(item)
    {
        if (!pm[item["_id"]["projId"]])
        {
            pm[item["_id"]["projId"]]={};
        }
        pm[item["_id"]["projId"]][item["_id"]["milestone"]]=item.count;
    });
    /**
     * classfiy week aggregate result by projId and weekMonth,week
     */
    let pw = {};
    depot.periodRs.forEach(function(item)
    {
        if (!pw[item["_id"]["projId"]])
        {
            pw[item["_id"]["projId"]]={};
        }

        if (!pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()])
        {
            pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()]=[];
        }
        pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()].push(item["_id"]["milestone"].toString());
    });
    let rs = [];
    /**
     * summary
     */
    depot.projects.forEach(function(project)
    {
        let co = new ChartVO();
        co.progress = project.progress;
        co.contractId = contractMap.get(project.contractId.toString()).contractId;
        co.customerName = contractMap.get(project.contractId.toString()).customerName;
        co.projectName = project.name;
        co.projectId = project.projectId;
        if (pmMap.has(project.pmId.toString()))
            co.pm = pmMap.get(project.pmId.toString()).userId;
        co.ms = {};
        depot.milestones.forEach(function(milestone)
        {
            if (pm[project._id] && pm[project._id][milestone.name])
                co.ms[milestone.name]=pm[project._id][milestone.name];
        });
        co.ws = {};
        for(let i=1;i<=12;i++){
            if (pw[project._id] && pw[project._id][i.toString()]  )
            {
                co.ws[i.toString()]=pw[project._id][i.toString()];
            }
        }
        rs.push(co);
    });
    return {rs:rs,milestones:depot.milestones};
}
function analyze1(depot)
{
    /**
     * month weeks
     * @type {Array}
     */
    let mw =[4,4,4,4,4,4,4,4,4,4,4,4];
    /**
     * get contract map that key is contract's id
     */
    let contractMap = arrayutil.convertToMap(depot.contracts,"_id");
    /**
     * get map of projectmanager that key is person's id
     */
    let pmMap = arrayutil.convertToMap(depot.pms,"_id");
    /**
     * classfiy milestone  aggregate result by projId and milestone
     */
    let pm = {};
    depot.milestoneRs.forEach(function(item)
    {
        if (!pm[item["_id"]["projId"]])
        {
            pm[item["_id"]["projId"]]={};
        }
        pm[item["_id"]["projId"]][item["_id"]["milestone"]]=item.count;
    });
    /**
     * classfiy week aggregate result by projId and weekMonth,week
     */
    let pw = {};
    depot.periodRs.forEach(function(item)
    {
        if (!pw[item["_id"]["projId"]])
        {
            pw[item["_id"]["projId"]]={};
        }

        if (!pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()])
        {
            pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()]={};
        }
        pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()][item["_id"]["week"].toString()]=item.count;
    });
    let rs = [];
    /**
     * summary
     */
    depot.projects.forEach(function(project)
    {
        let co = new ChartVO();
        co.progress = project.progress;
        co.contractId = contractMap.get(project.contractId.toString()).contractId;
        co.customerName = contractMap.get(project.contractId.toString()).customerName;
        co.projectName = project.name;
        co.projectId = project.projectId;
        if (pmMap.has(project.pmId.toString()))
            co.pm = pmMap.get(project.pmId.toString()).userId;
        co.ms = {};
        depot.milestones.forEach(function(milestone)
        {
            if (pm[project._id] && pm[project._id][milestone.name])
                co.ms[milestone.name]=pm[project._id][milestone.name];
        });
        co.ws = {};
        for(let i=1;i<=12;i++){
            for(let j=1;j<=5;j++){
                if (!co.ws[i.toString()])
                    co.ws[i.toString()]=[];
                if (j<5)
                    co.ws[i.toString()][j-1]=0;
                if (pw[project._id] && pw[project._id][i.toString()]  && pw[project._id][i.toString()][j.toString()] )
                {
                    if (j==5)
                        mw[i-1]=5;
                    co.ws[i.toString()][j-1]=pw[project._id][i.toString()][j.toString()];
                }
            }
        }
        rs.push(co);
    });
    return {mw:mw,rs:rs,milestones:depot.milestones};
}


module.exports = router;