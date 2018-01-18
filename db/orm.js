/**
 * Created by jensen on 2017/1/13.
 */
var db =  require("./db.js");
var {ObjectId} = require('mongodb');
var async = require('async');
exports.operTypes={INSERT:"insert",UPDATE:"update"}
/**
 * Join Get
 * @param col
 * @param id
 * @param callback
 * @param db
 */
exports.get=(col,id,callback,connection)=>{

    db.find(col,{_id: new ObjectId(id)},null,function(err,rs)
    {
        if (err)
            callback(err);
        else
        {
            if (rs.length>0)
                callback(null,rs[0]);
            else
                callback("not found");
        }
    },connection);
};

function aliasQuery(entity,ref,callback,connection)
{
    let defins = entity.getFieldDefin();
    if (defins[ref])
    {
        db.find(defins[ref].join.col, {_id: item[ref]},null, function (err, rs) {
            if (err)
                callback(err);
            else {
                if (rs.length > 0)
                    entity[defins[ref].alias] = rs[0];
                callback(null,rs[0]);
            }
        }, connection);
    }
}
exports.aliasGet=(col,alias,id,callback,connection)=>{
    db.getDb(function(err,db){
        if (err)callback(err);
        else
        {
            db.find(entity.getCollection(),{_id: new ObjectId(id)},null,function(err,rs)
            {
                if (rs.length>0) {
                    async.eachSeries(alias, function (a, cb) {
                        aliasQuery(rs[0], a, cb, db);
                    }, function (err) {
                        db.close();
                        callback(err,rs[0]);
                    });
                }
                else {
                    db.close();
                    callback(null);
                }
            },db);
        }
    });
};

exports.distinct=(col,condition,callback,connection)=>{

}
exports.find=(col,condition,sort,callback,connection)=>{
    db.find(col,condition,sort,callback,connection);
};
exports.aliasFind=(entity,alias,condition,sort,callback,conn)=>{
    let defins = entity.getFieldDefin();
    db.getDb(function(err,connection){
        if (err)callback(err);
        else
        {
            async.waterfall([
                function(cb){
                    db.find(entity.getCollection(),condition,sort,function(err,rs)
                    {
                        if (err)
                            cb(err);
                        else
                            cb(null,rs)
                    },connection);
                },
                function (rs,cb)
                {
                    async.each(rs, function(item, eachCallback) {
                        async.each(alias,function(a,aliasCallback){
                            if (defins[a])
                            {
                                if (defins[a].type==="ref") {
                                    db.find(defins[a].join.col, {_id: item[a]},null, function (err, rs) {
                                        if (err)
                                            aliasCallback(err,connection);
                                        else {
                                            if (rs.length > 0)
                                                item[defins[a].alias] = rs[0];
                                            aliasCallback(null,connection);
                                        }
                                    }, connection);
                                }
                                else {
                                    aliasCallback(null,connection);
                                    /*         db.find(defins[a].join.col, {_id: {"$in":item[a]}}, function (err, rs) {
                                     if (err)
                                     cb(err);
                                     else {
                                     if (rs.length > 0)
                                     item[defins[a].alias] = rs;
                                     }
                                     }, db);*/
                                }
                            }
                            else {
                                aliasCallback(null,connection);
                            }
                        }, function(err){
                            eachCallback(err,connection,rs);
                        });

                    }, function(err){
                        cb(err,connection,rs);
                    });
                }
            ], function (err,connection,rs) {
                {try {connection.close();} catch (e){logger.err(e);}}
                callback(err,rs);
            });
        }
    });
};
exports.insert=(entity,callback,connection)=>{
    db.insertOne(entity.getCollection(),entity,callback,connection);
};
exports.update = (entity,id,condition,callback,connection)=>{
    if (typeof(condition)=="function") {
        callback = condition;
        db.update(entity.getCollection(), {_id:new ObjectId(id)}, entity, callback,connection);
    }
    else
    {
        db.update(entity.getCollection(),condition, entity, callback,connection);
    }
};
exports.del = (entity,callback,connection)=>{
    db.delOne(entity.getCollection(), {_id:new ObjectId(entity._id)}, callback,connection);
};
exports.delById = (col,id,callback,connection)=>{
    db.delOne(col, {_id:new ObjectId(id)}, callback,connection);
};
exports.delMany = (col,condition,callback,connection)=>{
    db.delMany(col, condition, callback,connection);
};
exports.pagingquery = (entity,condition,page,callback,connection)=>{
    let opts = {start:page.pn*page.ps,limit:page.ps};
    if (page.sort)
        opts.sort = page.sort;
    db.pagingquery(entity.getCollection(),condition,opts,function(err,cols,count)
    {
        if (count) {
            page.count = count;
            page.totalPage = parseInt(page.count/page.ps);
            if (!page.totalPage)page.totalPage =0;
            if ((page.totalPage*page.ps)<page.count)
                page.totalPage++;
        }
        callback(err,cols,count);
    },connection);
};
/**
 * Join Query
 * @param entity
 * @param alias
 * @param condition
 * @param page
 * @param callback
 * @param db
 */
exports.pagejoinquery = (entity,alias,condition,page,callback,connection)=>
{
    let opts = {start:page.pn*page.ps,limit:page.ps};
    let defins = entity.getFieldDefin();
    db.getDb(function(err,connection){
        if (err)callback(err);
        else
        {
            async.waterfall([
                function(cb){
                    db.pagingquery(entity.getCollection(),condition,opts,function(err,rs,count)
                    {
                        if (count) {
                            page.count = count;
                            page.totalPage = parseInt(page.count/page.ps);
                            if (!page.totalPage)page.totalPage =0;
                            if ((page.totalPage*page.ps)<page.count)
                                page.totalPage++;
                        }
                        cb(err,connection,rs);
                    },connection);
                },
                function (connection,rs,cb)
                {
                    async.each(rs, function(item, eachCallback) {
                        async.each(alias,function(a,aliasCallback){
                            if (defins[a])
                            {
                                if (defins[a].type==="ref") {
                                    db.find(defins[a].join.col, {_id: item[a]},null, function (err, rs) {
                                        if (err)
                                            aliasCallback(err,connection);
                                        else {
                                            if (rs.length > 0)
                                                item[defins[a].alias] = rs[0];
                                            aliasCallback(null,connection);
                                        }
                                    }, connection);
                                }
                                else {
                                    aliasCallback(null,connection);
                                    /*         db.find(defins[a].join.col, {_id: {"$in":item[a]}}, function (err, rs) {
                                     if (err)
                                     cb(err);
                                     else {
                                     if (rs.length > 0)
                                     item[defins[a].alias] = rs;
                                     }
                                     }, db);*/
                                }
                            }
                            else {
                                aliasCallback(null,connection);
                            }
                        }, function(err){
                            eachCallback(err,connection,rs);
                        });

                    }, function(err){
                        cb(err,connection,rs);
                    });
                }
            ], function (err,connection,rs) {
                {try {connection.close();} catch (e){logger.err(e);}}
                callback(err,rs);
            });
        }
    });
}