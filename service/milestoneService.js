/**
 * Created by jensen on 2017/2/6.
 */
const orm = require('../db/orm');
var milestones = null;
function refreshMilestones(callback,connection)
{
    orm.find("milestone", {}, {seq:1,type:1}, function (err, rs) {
        this.milestones = rs;
    },connection);
}
exports.getAll = function(callback,connection)
{
    if (milestones==null) {
        orm.find("milestone", {}, {seq:1,type:1}, function (err, rs) {
            milestones = rs;
            callback(null,milestones);
        },connection);
    }
    else
    {
        callback(null,milestones);
    }
};
exports.refreshMilestones=refreshMilestones;
exports.save=(m,callback)=>
{
    orm.insert(m,function(err,rs)
    {
        if (!err)
            refreshMilestones();
       callback(err,rs);
    });
};
exports.update=(m,id,callback)=>
{
    orm.update(m,id,function(err,rs)
    {
        if (!err)
            refreshMilestones();
        callback(err,rs);
    });

};
