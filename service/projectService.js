/**
 * Created by jensen on 2017/2/6.
 */
const orm = require('../db/orm');
const db = require('../db/db')
const Project = require('../domain/model').Project;
const projectStatus = require('../db/constants').projectStatus;
const Milestone = require('../domain/model').Milestone;
const milestoneService = require('./milestoneService');
const arrayutil = require('../util/arrayutils')
const moment = require('moment')
/**
 * get next milestone
 * @param milestone milestone instance
 * @param callback  callback
 */
function getNextMilestone(planMilestones,milestoneName,callback,connection)
{
    milestoneService.getAll(function(err,ms)
    {
        let milestoneMap = arrayutil.convertToMap(ms,"name");
        if (err)
            callback(err);
        else {
            let pct = 0;
            let nm = null;
            if (milestoneName !=null  ) {
                for (let i = 0; i < planMilestones.length; i++) {
                    if (planMilestones[i] == milestoneName) {
                        pct = milestoneMap.get(planMilestones[i]).pct;
                        if (i < (planMilestones.length - 1)) {
                            nm = planMilestones[i + 1];
                            break;
                        }
                    }
                    else   pct = milestoneMap.get(planMilestones[i]).pct;
                }
            }
            else
            {
                nm = planMilestones[0];
            }
            callback(err, nm, pct);
        }
    },connection);
/*    orm.find((new Milestone()).getCollection(),{name:milestoneName},{seq:1},function(err,rs)
    {
        orm.find((new Milestone()).getCollection(),(milestone)?{seq:{$gt:milestone.seq}}:{},{seq:1},function(err,rs)
        {
            if (err)callback(err);
            else
            {
                if (rs.length>0)
                    callback(null,rs[0]);
                else
                    callback(new Error("No Record"));
            }
        });
    });*/

}
exports.updateMilestone=(projId,milestone,callback,connection)=>
{
    orm.get((new Project()).getCollection(),projId,function(err,p)
    {
        if (err)
            callback(err);
        else
        {
            if ( p.completedMilestone!=null && p.completedMilestone==milestone)
            {
                callback(null,p);
            }
            else {
                p.completedMilestone = milestone;
                if (p.planedMilestones && p.planedMilestones.length>0)
                {
                    getNextMilestone(p.planedMilestones, p.completedMilestone, function (err, milestone, pct) {
                        if (err)
                            callback(err);
                        else {
                            p.currentMilestone = milestone;
                            p.progress = pct;
                            if (p.currentMilestone) {
                                p.taskId = p.type + "-" + p.projectId+ "-" + p.currentMilestone;
                                p.status = projectStatus.STATUS_PROCESS;
                            }
                            else {
                                p.taskId =   p.type + "-" + p.projectId+"-";//+ "-" + p.currentMilestone;
                                p.status = projectStatus.STATUS_COMPLETED;
                            }
                            p.sysProj = p.type + "-" + p.projectId;
                            db.update("project", {_id: p._id}, p, function (err, rs) {
                                callback(err, rs);
                            },connection);
                        }


                    },connection );
                }
            }
        }

    },connection);
};
exports.save=(p,callback)=>
{
    if (p.completedMilestone && p.completedMilestone.length<0)
        p.completedMilestone = null;
    getNextMilestone(p.planedMilestones,p.completedMilestone,function(err,milestone,pct)
    {
        p.currentMilestone = milestone;
        p.progress = pct;
        if (p.currentMilestone)
            p.taskId = p.type + "-" + p.projectId+"-" + p.currentMilestone;
        else
            p.taskId =   p.type + "-" + p.projectId+"-";//+ "-" + p.currentMilestone;
        p.sysProj = p.type + "-" + p.projectId;
        p.status = projectStatus.STATUS_PROCESS;
        orm.insert(p,function(err,rs)
        {
           callback(err,rs);
        });

    });
};
exports.update=(p,id,callback)=>
{
    if (p.completedMilestone && p.completedMilestone.length<0)
        p.completedMilestone = null;
    getNextMilestone(p.planedMilestones,p.completedMilestone,function(err,milestone,pct)
    {
        /**
         * if not found next milestone,closeure the project
         */
        p.sysProj =  p.type + "-" + p.projectId;
        if (err || milestone==null)
        {
            p.status = projectStatus.STATUS_COMPLETED;
            p.currentMilestone = null;
            p.taskId =   p.type + "-" + p.projectId+"-";//+ "-" + p.currentMilestone;
        }
        else {
            p.status = projectStatus.STATUS_PROCESS;
            p.currentMilestone = milestone;
            p.taskId = p.type + "-" + p.projectId + "-" + p.currentMilestone;
        }
        orm.update(p,id,function(err,rs)
        {
           callback(err,rs);
        });
    });
};
