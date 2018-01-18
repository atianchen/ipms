/**
 * Created by jensen on 2017/1/17.
 */
const express = require('express');
const router = express.Router();
const  orm = require('../../db/orm');
const wb = require('../../util/webutils');
const MileStone = require('../../domain/model').Milestone;
const milestoneService = require('../../service/milestoneService');
router.post("/load",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};
    let m = new MileStone();
    orm.pagejoinquery(new MileStone(),null,q,page,function(err,rs)
    {
        if (req.body.id)
        {
            orm.get(p.getCollection(),req.body.id,function(err,rs)
            {
                res.json({page:page,data:rs,milestone:rs});
            });
        }
        else {
            res.json({page: page, data: rs});
        }
      //  res.json({page:page,data:rs,q:q});
    });
/*    orm.find(m.getCollection(),{},null,function(err,rs)
    {
        if (req.body.id)
        {
            orm.get(p.getCollection(),req.body.id,function(err,rs)
            {
                res.json({data:rs,milestone:rs});
            });
        }
        else {
            res.json({page: page, data: rs});
        }
    });*/
});
router.post("/get",function(req,res)
{
    let p = new MileStone();
    orm.get(p.getCollection(),req.body.id,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/getAll",function(req,res)
{
    let p = new MileStone();
    orm.find(p.getCollection(),{},{type:1,seq:1},function(err,rs)
    {
        res.json({milestones:rs});
    });
});
router.post("/save",function(req,res)
{
    let p = new MileStone();
    wb.mappingObj(req,req.body.milestone,p,orm.operTypes.INSERT);
    milestoneService.save(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new MileStone();
    orm.get(p.getCollection(),req.body.milestone._id,function(err,rs)
    {
        Object.assign(p,rs);
        wb.mappingObj(req,req.body.milestone,p,orm.operTypes.UPDATE);
        milestoneService.update(p,req.body.milestone._id,function(err,rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new MileStone();
    orm.delById(p.getCollection(),req.body.role._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;

