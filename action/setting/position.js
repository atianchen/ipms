/**
 * Created by jensen on 2017/1/27.
 */
const express = require('express');
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const {Position,Currency} = require('../../domain/model');
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};
    orm.pagingquery(new Position(),q,page,function(err,rs)
    {
        res.json({page:page,data:rs});
    });
});
router.post("/get",function(req,res)
{
    let model = {};
    orm.find("currency",{},{createDate:1},function(err,rs)
    {
        if (err)
        {
            res.json({err: err});
        }
        else {
            model.currency = rs;
            if (req.body && req.body.id) {
                let p = new Position();
                orm.get(p.getCollection(),req.body.id,function(err,rs)
                {
                    model.data = rs;
                    res.json(model);
                });
            }
            else {
                res.json(model);
            }
        }
    });

});
router.post("/save",function(req,res)
{
    let p = new Position();
    wb.mappingObj(req,req.body.position,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new Position();
    orm.get(p.getCollection(),req.body.position._id,function(err,rs)
    {
        Object.assign(p, rs);
        wb.mappingObj(req,req.body.position,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.position._id,function(rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new Position();
    orm.delById(p.getCollection(),req.body.position._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;

