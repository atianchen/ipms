/**
 * Created by jensen on 2017/1/31.
 */
const express = require('express');
const router = express.Router();
const moment = require('moment')
const db = require('../../db/db');
const wb = require('../../util/webutils');
router.post("/colchart",function(req,res)
{
    db.getDb(function(err,connection)
    {
        if (err)
            res.json({err:err});
        else
        {
            let st = moment().subtract(5, 'days');
            let et = moment().add(1, 'days');

            connection.collection('entryrecord').aggregate(
                [
                    { $match: {$or:[{ "modifiedDate": { "$gte": st.unix(), "$lte": et.unix() }},{ "createDate": { "$gte": st.unix(), "$lte": et.unix() }}]}},
                    { $sort: { "year": 1, "month": 1, "day": 1 } },
                    { $group: { "_id": {year : "$year",month : "$month",day : "$day",period:'$period'}, "count": { $sum: 1 } } }
                ]).toArray(function(err, result) {
                connection.close();
                res.json({data:result,st:st.valueOf(),et:moment().valueOf()});
            });
        }
    });
});
module.exports = router;