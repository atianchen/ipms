/*
 Created by Andersen 03-26
 */

const express = require('express');
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const ProjectStatus = require('../../domain/model').ProjectStatus;
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = {};

    orm.pagingquery(new ProjectStatus(),q,page,function(err,rs)
    {
        res.json({page:page,data:rs});
    });
});
router.post("/get",function(req,res)
{
    let p = new ProjectStatus();
    orm.get(p.getCollection(),req.body.id,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/save",function(req,res)
{
    let p = new ProjectStatus();
    wb.mappingObj(req,req.body.projectstatus,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new ProjectStatus();
    orm.get(p.getCollection(),req.body.projectstatus._id,function(err,rs)
    {
        Object.assign(rs, p);
        wb.mappingObj(req,req.body.projectstatus,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.projectstatus._id,function(rs)
        {
            res.json({data:p});
        });

    });

});

router.post("/del",function(req,res)
{
    let p = new ProjectStatus();
    orm.delById(p.getCollection(),req.projectstatus._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;
