/**
 * Created by jensen on 2017/1/23.
 */
const express = require('express');
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const Action = require('../../domain/model').Action;
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};

    orm.pagingquery(new Action(),q,page,function(err,rs)
    {
        res.json({page:page,data:rs});
    });
});
router.post("/get",function(req,res)
{
    let p = new Action();
    orm.get(p.getCollection(),req.body.id,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/save",function(req,res)
{
    let p = new Action();
    wb.mappingObj(req,req.body.action,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new Action();
    orm.get(p.getCollection(),req.body.action._id,function(err,rs)
    {
        Object.assign(rs, p);
        wb.mappingObj(req,req.body.action,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.action._id,function(rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new Action();
    orm.delById(p.getCollection(),req.body.action._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;

