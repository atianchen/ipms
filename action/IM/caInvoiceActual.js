/*
 * Accural-in forecast by andersen 2018-02-07
 */
const express = require("express");
const router = express.Router();
const async = require('async');
const orm = require('../../db/orm');
const db = require('../../db/db');
const wb = require('../../util/webutils');
const moment = require('moment');
const appContext = require('../../ctx/appContext');
const Constants = require('../../ctx/constants').Constants;
const {MonthWeek,Project,WeekAccrualForecast} = require('../../domain/model');
const projectStatus = require('../../db/constants').projectStatus;
const {ObjectId} = require('mongodb');
router.post("/listForecastContract",function(req,res){
    let page = wb.getPagination(req);
    let user = req.session[Constants.LOGIN_USER_KEY];
    let q = {pmId:ObjectId(user._id)};//req.body.q||{};
    q["status"]={ $ne : projectStatus.STATUS_END };
    orm.pagejoinquery(new Project(),["pmId","contractId"],q,page,function(err,rs)
    {
        let model = {};
        model.page = page;
        model.data = rs;
        res.json(model);
    });
});

router.post("/getAccuralForecast",function(req,res){
    let user = req.session[Constants.LOGIN_USER_KEY];
    orm.aliasGet(new Project(),["pmId","contractId"],req.body.projId,(err,proj)=>
    {
        if (err)
            res.json({err:err});
        else {
            orm.find((new MonthWeek()).getCollection(), {
                startDate: {$gte: parseInt(req.body.startDate)},
                endDate: {$lte: parseInt(req.body.endDate)}
            }, {yearSeq: 1}, (err, mws) => {
                if (err)
                    res.json({err: err});
                else {
                    let model = {};
                    model["proj"] = proj;
                    model["mws"] = mws;
                    orm.find((new WeekAccrualForecast()).getCollection(), {
                        monthweekId:{$in:mws.map((x)=> x._id)}
                    }, {year:1,yearSeq: 1}, (err, rs) => {
                        let map = {};
                        let depot = {};
                        rs.forEach((wc)=>
                        {
                            map[wc.monthweekId]=wc;
                        });
                        mws.forEach((item)=>
                        {
                            if (map[item._id])
                            {
                                depot[item._id]=map[item._id];
                            }
                            else {
                                let wcf = new  WeekAccrualForecast();
                                wcf.monthweekId = item._id;
                                wcf.accrual = 0;
                                wcf.seq  = item.seq;
                                wcf.year = item.year;
                                wcf.month = item.month;
                                wcf.yearSeq = item.yearSeq;
                                wcf.startDate = item.startDate;
                                wcf.endDate = item.endDate;
                                depot[item._id]=wcf;
                            }
                        })
                        model["accuralforecast"]=depot;
                        res.json(model);
                    });

                }
            });
        }
    });
});
router.post("/saveAccuralForecast",function(req,res){
    let user = req.session[Constants.LOGIN_USER_KEY];
    let accuralforecast = req.body.accuralforecast;
    let wcf = new WeekAccrualForecast();
    let depot = {};
    db.getDb(function(err,connection) {
        if (err) {
            model.err = err;
        }
        else {
            let ary = [];
            for (var key in accuralforecast)
            {
                ary.push( accuralforecast[key]);
            }
            async.map(ary,
                function(item, callback) {
                    item.personId = ObjectId(user._id);
                    item.monthweekId = ObjectId(item.monthweekId);
                    item.seq  = parseInt(item.seq);
                    item.year =  parseInt(item.year);
                    item.month =  parseInt(item.month);
                    item.yearSeq =  parseInt(item.yearSeq);
                    item.startDate =  parseInt(item.startDate);
                    item.endDate =  parseInt(item.endDate);
                    item.accrual =  parseFloat(item.accrual);
                    if (item._id) {
                        item._id = ObjectId(item._id);
                        db.update(wcf.getCollection(), {_id:item._id}, item, function (err, rs) {
                            depot[item.monthweekId]=item;
                            callback(err, rs);
                        }, connection);
                    }
                    else {
                        db.insertOne(wcf.getCollection(), item, function (err, rs) {
                            depot[rs.monthweekId]=rs;
                            callback(err, rs);
                        }, connection);
                    }

                },
                function(err, results) {

                    if (err)
                        res.json({err:err});
                    else
                    {
                        res.json({accuralforecast:depot});
                    }
                }
            );

        }
    });

});
module.exports = router;


