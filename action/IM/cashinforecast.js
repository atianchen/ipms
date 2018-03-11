/*
* Cash-in forecast by andersen 2018-02-07
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
const {MonthWeek,Project,WeekCashForecast} = require('../../domain/model');
const projectStatus = require('../../db/constants').projectStatus;
const logger = require("../../util/logger").log;
const {ObjectId} = require('mongodb');
router.post("/listForecastProj",function(req,res){
    let page = wb.getPagination(req);
    let user = req.session[Constants.LOGIN_USER_KEY];
    let q = {};//req.body.q||{};
    if (wb.containsQueryParam(req,"q","contractId"))
    {
        q["contractId"]= {$regex: req.body.q.contractId.contractId.trim(), $options:'i'};
    }
    q["memberIds"]={$in:[ObjectId(user._id)]};
    q["status"]={ $ne : projectStatus.STATUS_END };
    orm.pagejoinquery(new Project(),["pmId","contractId"],q,page,function(err,rs)
    {
        let model = {};
        model.page = page;
        model.data = rs;
        res.json(model);
    });

});

router.post("/getCashForecast",function(req,res){
    let user = req.session[Constants.LOGIN_USER_KEY];
    orm.aliasGet(new Project(),["pmId","contractId"],req.body.projId,(err,proj)=>
    {
        if (err)
            res.json({err:err});
        else {
            orm.find((new MonthWeek()).getCollection(), {
                endDate: {$gte: parseInt(req.body.startDate)}
            }, {yearSeq: 1}, (err, mws) => {
                if (err)
                    res.json({err: err});
                else {
                    let model = {};
                    model["proj"] = proj;
                    model["mws"] = mws;
                    orm.find((new WeekCashForecast()).getCollection(), {
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
                                let wcf = new  WeekCashForecast();
                                wcf.monthweekId = item._id;
                                wcf.cash = 0;
                                wcf.seq  = item.seq;
                                wcf.year = item.year;
                                wcf.month = item.month;
                                wcf.yearSeq = item.yearSeq;
                                wcf.startDate = item.startDate;
                                wcf.endDate = item.endDate;
                                depot[item._id]=wcf;
                            }
                        })
                        model["cashforecast"]=depot;
                        res.json(model);
                    });

                }
            });
        }
    });
});
router.post("/saveCashForecast",function(req,res){
    let user = req.session[Constants.LOGIN_USER_KEY];
    let cashforecast = req.body.cashforecast;
    let wcf = new WeekCashForecast();
    let depot = {};
        db.getDb(function(err,connection) {
            if (err) {
                model.err = err;
            }
            else {
                let ary = [];
                for (var key in cashforecast)
                {
                    ary.push( cashforecast[key]);
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
                        item.cash =  parseFloat(item.cash);
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
                        try { connection.close(); } catch (e){logger.err(e);}
                      if (err)
                          res.json({err:err});
                      else
                      {
                          res.json({cashforecast:depot});
                      }
                    }
                );

            }
        });

});
module.exports = router;


