/**
 * Created by jensen on 2017/2/10.
 */
const express = require('express');
const router = express.Router();
const  orm = require('../../db/orm');
const wb = require('../../util/webutils');
const MilestoneType = require('../../domain/model').MilestoneType;
router.post("/load",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};
    orm.pagingquery(new MilestoneType(),q,page,function(err,rs)
    {
        res.json({page:page,data:rs});
    });
});
router.post("/getAll",function(req,res)
{
    orm.find((new MilestoneType()).getCollection(),{},{createDate:1},function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/get",function(req,res)
{
    let p = new MilestoneType();
    orm.get(p.getCollection(),req.body.id,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/save",function(req,res)
{
    let p = new MilestoneType();
    wb.mappingObj(req,req.body.type,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new MilestoneType();
    orm.get(p.getCollection(),req.body.type._id,function(err,rs)
    {
        Object.assign(p, rs);
        wb.mappingObj(req,req.body.type,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.type._id,function(rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new MilestoneType();
    orm.delById(p.getCollection(),req.body.type._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;

