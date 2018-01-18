/**
 * Created by jensen on 2017/1/16.
 */
const express = require('express');
const router = express.Router();
const  orm = require('../../db/orm');
const wb = require('../../util/webutils');
const {Role,Menu} = require('../../domain/model');
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};

    orm.pagingquery(new Role(),q,page,function(err,rs)
    {
        res.json({page:page,data:rs});
    });
});
router.post("/get",function(req,res)
{
    orm.find((new Menu()).getCollection(),{parentId:{$ne:null}},null,function(err,ms)
    {
        if (err)
            res.json({err:err});
        else {
            if (req.body.id) {
                let p = new Role();
                orm.get(p.getCollection(), req.body.id, function (err, rs) {
                    res.json({data: rs,ms:ms});
                });
            }
            else
            {
                res.json({ms:ms});
            }
        }
    });

});
router.post("/save",function(req,res)
{
    let p = new Role();
    wb.mappingObj(req,req.body.role,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new Role();
    orm.get(p.getCollection(),req.body.role._id,function(err,rs)
    {
        Object.assign(rs, p);
        wb.mappingObj(req,req.body.role,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.role._id,function(rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new Role();
    orm.delById(p.getCollection(),req.body.role._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;

