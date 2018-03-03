const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const logger = require("../../util/logger").log;
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const {MonthWeek,Project,WeekPlan} = require('../../domain/model');
const projectStatus = require('../../db/constants').projectStatus;
const {ObjectId} = require('mongodb');
router.post("/listWeekForPlan",function(req,res){
    let page = wb.getPagination(req);
    let user = req.session[Constants.LOGIN_USER_KEY];
    let q = {
        startDate: {$gte: parseInt(req.body.startDate)},
        endDate: {$lte: parseInt(req.body.endDate)}
    }
    page.sort={yearSeq:1};
    orm.pagejoinquery(new MonthWeek(),null,q,page,function(err,rs)
    {
        let model = {};
        model.page = page;
        model.data = rs;
        res.json(model);
    });
});
router.post("/getWeekPlan",function(req,res){
    let user = req.session[Constants.LOGIN_USER_KEY];
    orm.get((new MonthWeek()).getCollection(),req.body.monthWeekId,function(err,rs)
    {
        orm.find((new Project()).getCollection(), {
            $or:[{memberIds:{$in:[ObjectId(user._id)]}},{pmId:ObjectId(user._id)}]
            }, {name: 1}, (err, projs) =>
            {
                orm.find((new WeekPlan()).getCollection(), {
                     personId:ObjectId(user._id),
                    monthweekId:ObjectId(req.body.monthWeekId),
                    }, null, (err, plans) =>
                    {
                        res.json({monthWeek:rs,projs:projs,plans:plans});
                    }
                );
            }
        );

    });
});
router.post("/saveWeekPlan",function(req,res){
    let model = {};
    let wps = [];
    let plans = req.body.plans;
    let monthweekId = req.body.monthweekId;
    let user = req.session[Constants.LOGIN_USER_KEY];
    for (let time in plans)
    {
        let planTime = moment(time*1000);
        for (let period in plans[time])
        {
            if (plans[time][period].projId.length>0)
            {
                let wp = new WeekPlan();
                if (plans[time][period]._id)
                 wp._id=ObjectId(plans[time][period]._id);
                wp.monthweekId = ObjectId(monthweekId);
                wp.projectId = ObjectId(plans[time][period].projId);
                wp.personId = ObjectId(user._id);
                wp.milestone = plans[time][period].milestone;
                wp.period = period;
                wp.year = parseInt(planTime.format("YYYY"));
                wp.month = parseInt(planTime.format("MM"));
                wp.day = parseInt(planTime.format("DD"));
                wp.planDate = planTime.unix();
                wps.push(wp);
            }

        }
    }
    db.getDb(function(err,connection) {
        async.map(wps,
            function(wp, callback) {
                if (wp._id)
                {
                    db.update(wp.getCollection(), {_id:wp._id}, wp, function (err, rs) {
                        callback(err, rs);
                    }, connection);
                }
                else {
                    db.insertOne(wp.getCollection(), wp, function (err, rs) {
                        callback(err, rs);
                    }, connection);
                }

            },
            function(err, results) {
                try { connection.close(); } catch (e){logger.err(e);}
                if (err) {
                    res.json({err: err});
                }
                else
                {
                    res.json({wps:wps});
                }
            }
        );
    });

});
module.exports = router;