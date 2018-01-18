/**
 * Created by jensen on 2017/1/13.
 */
var factory = require("./factory.js");
var types = require("./constants.js");
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var logger = require("../util/logger").log;
var connectUrl = null;
function connect(callback)
{
    MongoClient.connect(connectUrl, function(err, db) {
        callback(err,db);
    });
}
exports.initdb=()=>{
    connectUrl = factory.getConnectUrl(types.dbType.MONGODB);
}
exports.connect=connect;
exports.getDb=(callback)=>
{
    connect(function(err,db){
        callback(err,db);
    });
};

exports.distinct = (col,property,condition,callback,db)=>
{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            collection.distinct(property,condition,function(err,rs)
            {
                if (err)cb(err,db);
                else {
                    cb(null,db, rs);
                }
            });
        }
    ], function (err,db, data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
}
exports.insertOne=(col,data,callback,db)=>{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                   cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            collection.insertOne(data,function(err,rs)
            {
                if (err)cb(err,db);
                else {
                    data._id=rs.insertedId;
                    cb(null,db, data);
                }
            });
        }
    ], function (err,db, data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
};

exports.insert=(col,data,callback,db)=>{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            collection.insertMany(data,function(err,rs)
            {
                if (err)cb(err,db);
                else cb(null,db,rs);
            });
        }
    ], function (err, db,data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
};

exports.updateMany = (col,condition,data,callback,db)=>
{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            let rs = collection.updateMany(condition,data,function(err,rs)
            {
                if (err)cb(err,db);
                else cb(null,db,rs);
            });
        }
    ], function (err, db,data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
};

exports.update = (col,condition,data,callback,db)=>{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            let rs = collection.updateOne(condition,data,function(err,rs)
            {
                if (err)cb(err,db);
                else cb(null,db,rs);
            });
        }
    ], function (err, db,data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
};
exports.find = (col,condition,sort,callback,db)=>{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            if (sort) {
                collection.find(condition).sort(sort).toArray(function (err, docs) {
                    if (err) cb(err, db);
                    else cb(null, db, docs);
                })
            }
            else {
                collection.find(condition).toArray(function (err, docs) {
                    if (err) cb(err, db);
                    else cb(null, db, docs);
                })
            }
        }
    ], function (err, db,data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}

        callback(err,data);
    });
};
exports.pagingquery = (col,condition,opts,callback,db)=>{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null,db);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            let count = collection.find(condition).count((err,count)=>
            {
                if (err)
                    cb(err,db);
                else {
                    let pageSort = null;
                    if (opts.sort)
                        pageSort = opts.sort;
                    else
                        pageSort = {createDate:1};
                    collection.find(condition).sort(pageSort).skip(opts.start).limit(opts.limit).toArray(function (err, docs) {
                        if (err) cb(err, db);
                        else cb(null, db, docs, count);
                    });
                }
            });


        }
    ], function (err, db,data,count) {
        if (db && db.hold) {try {db.close();} catch (e){logger.err(e);}}
        callback(err,data,count);
    });
};
exports.delOne=(col,condition,callback,db)=>
{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, cb);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            collection.deleteOne(condition, function(err, result) {
                if (err)cb(err,db);
                else cb(null,db,result);
            });
        }
    ], function (err, db,data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
};
exports.delMany=(col,condition)=>
{
    async.waterfall([
        function(cb){
            if (db) {
                cb(null, cb);
            }
            else
            {
                connect(function(err,db){
                    if (db)db.hold=true;
                    cb(err,db);
                });
            }
        },
        function (db,cb)
        {
            let collection = db.collection(col);
            collection.deleteMany(condition, function(err, result) {
                if (err)cb(err,db);
                else cb(err,db,result);
                if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
            });
        }
    ], function (err, db,data) {
        if (db && db.hold) {try { db.close(); } catch (e){logger.err(e);}}
        callback(err,data);
    });
};

