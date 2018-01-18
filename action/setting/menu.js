/**
 * Created by jensen on 2017/1/20.
 */
const express = require('express');
const router = express.Router();
const orm = require('../../db/orm');
const wb = require('../../util/webutils');
const {Menu,MenuGroup} = require('../../domain/model');
router.post("/list",function(req,res)
{
    let page = wb.getPagination(req);
    let q = req.body.q||{};
    page.sort={createDate:1};
    orm.pagingquery(new Menu(),q,page,function(err,rs)
    {
        res.json({page:page,data:rs});
    });
});
router.post("/get",function(req,res)
{
    orm.find((new MenuGroup()).getCollection(),{},null,function(err,groups)
    {
        if (err)
            res.json({err:err});
        else
        {
            orm.find((new Menu()).getCollection(),{},null,function(err,menus)
            {
                if (req.body && req.body.id) {
                    let p = new Menu();
                    orm.get(p.getCollection(), req.body.id, function (err, rs) {
                        if (err)
                            res.json({err:err});
                        else {
                            res.json({groups: groups, data: rs, menus: menus});
                        }
                    });
                }
                else
                {
                    res.json({groups:groups,menus:menus});
                }
            });


        }
    });


});
router.post("/save",function(req,res)
{
    let p = new Menu();
    wb.mappingObj(req,req.body.menu,p,orm.operTypes.INSERT);
    orm.insert(p,function(err,rs)
    {
        res.json({data:rs});
    });
});
router.post("/update",function(req,res)
{
    let p = new Menu();
    orm.get(p.getCollection(),req.body.menu._id,function(err,rs)
    {
        Object.assign(p,rs);
        wb.mappingObj(req,req.body.menu,p,orm.operTypes.UPDATE);
        orm.update(p,req.body.menu._id,function(rs)
        {
            res.json({data:p});
        });

    });

});
router.post("/del",function(req,res)
{
    let p = new Menu();
    orm.delById(p.getCollection(),req.body.menu._id,function(err,rs)
    {
        if (err)
            res.json({err:err});
        else
            res.json({data:rs});
    });

});
module.exports = router;

