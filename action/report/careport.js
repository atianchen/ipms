/**
 * Cash and Accrual Report
 * Created by jensen on 2017/2/8.
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
router.post("/cashAccrualReport",function(req,res)
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
        async.waterfall([
            (cb) => {
                db.find("milestonetype", {}, {"createDate": 1}, function (err, rs) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        cache.milestoneTypes = rs;
                        cb(null);
                    }
                }, connection)
            },
            (cb) => {
                let mt = null;
                if (req.body.milestoneType)
                    mt = req.body.milestoneType;
                else
                    mt = cache.milestoneTypes[0].name;
                cache.mt = mt;
                db.find("milestone", {type:mt}, {"seq": 1}, function (err, rs) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        cache.milestones = rs;
                        cb(null);
                    }
                }, connection)
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
            (cb) => {
                db.distinct("project", "contractId", {"_id": {$in: cache.projIds},type:cache.mt}, function (err, rs) {
                    if (err)
                        cb(err);
                    else {
                        cache.contractIds = rs;
                        cb(null);
                    }
                }, connection);
            },
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
             * get contract's pmId in spec year
             * @param cb
             */
                (cb) => {
                db.distinct("project", "pmId", {"_id": {$in: cache.projIds}}, function (err, rs) {
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
            (cb)=>
            {

                connection.collection('entryrecord').aggregate(
                    [
                        {$match: {milestone:{$in:cache.milestones.map(x=>x.name)},
                            $or:[{"modifiedDate": {"$gte": st.unix(), "$lte": et.unix()}},{"createDate": {"$gte": st.unix(), "$lte": et.unix()}}]}},
                        {$sort: {"projId": 1, "weekMonth": 1}},
                        {$group: {"_id": {projId: "$projId", weekMonth: "$weekMonth"}, "cash": {$sum: "$cash"}}}
                    ]).toArray(function (err, result) {
                    if (err)
                        cb(err);
                    else {
                        cache.cashRs = result;
                        cb(null);
                    }
                });
            }
        ],function (err) {
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
                    result.years = years;
                    result.year = year;
                    result.milestoneType = cache.mt;
                    res.json(result);
                }
                catch (e)
                {
                    res.json({err: e});
                }
            }
        });
    });
});

class ChartVO
{

}
function analyze(depot)
{
    try {
        let rs = [];
        let contractMap = arrayutil.convertToMap(depot.contracts, "_id");
        let pmMap = arrayutil.convertToMap(depot.pms,"_id");
        let milestoneMap = arrayutil.convertToMap(depot.milestones, "name");

        let contract = null;
        let pw={};
        depot.cashRs.forEach(function(item)
        {
            if (!pw[item["_id"]["projId"]])
            {
                pw[item["_id"]["projId"]]={};
            }

            if (!pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()])
            {
                pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()]={};
            }
            pw[item["_id"]["projId"]][item["_id"]["weekMonth"].toString()]=item.cash;
        });
        depot.projects.forEach(function(project) {
            let co = new ChartVO();
            contract = contractMap.get(project.contractId.toString());
            co.imp = contract.imp;
            co.cus = contract.cus;
            co.contractId = contract.contractId;
            co.signedYear = contract.signedYear;
            co.productLine = contract.productLine;
            co.customerAbbr = contract.customerAbbr;
            co.projName = project.name;
            co.projId = project.projectId;
            co.projType = project.type;
            co.sysProj = project.sysProj;
            if (project.pmId)
                if (pmMap.has(project.pmId.toString()))
                    co.pm = pmMap.get(project.pmId.toString()).userId;
            co.currency = contract.currency;
            co.amt = contract.amt;
            co.cum = 100 - contract.processOpen;//累计进度
            co.cashInOpen = contract.cashInOpen;
            co.open = contract.processOpen;
            co.monthCash = [];
            co.monthSum = 0;
            for (let i = 1; i <= 12; i++) {
                if (pw[project._id.toString()] && pw[project._id.toString()][i.toString()]) {
                    co.monthCash.push(pw[project._id.toString()][i.toString()]);
                    co.monthSum += pw[project._id.toString()][i.toString()];
                }
                else {
                    co.monthCash.push(0);
                }
            }
            co.ma = {};//milestone  Accrual
            co.masum = 0;
            if (project.planedMilestones)
            {
                for (let i = 0; i < project.planedMilestones.length; i++) {
                    if (project.completedMilestone) {
                        if (i == 0) {
                            co.ma[project.planedMilestones[i]] = contract.amt * (milestoneMap.get(project.planedMilestones[i]).pct / 100);
                        }
                        else {
                            co.ma[project.planedMilestones[i]] = contract.amt * ((milestoneMap.get(project.planedMilestones[i]).pct - milestoneMap.get(project.planedMilestones[i - 1]).pct) / 100);
                        }
                        co.masum += co.ma[project.planedMilestones[i]];
                        if (project.completedMilestone == project.planedMilestones[i])
                            break;
                    }
                }
             }
            rs.push(co);

        });
        return {rs:rs,milestones:depot.milestones,milestoneTypes:depot.milestoneTypes};
    }
    catch (e)
    {
      throw e;
    }
}
module.exports = router;