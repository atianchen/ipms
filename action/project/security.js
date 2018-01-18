/**
 * Created by jensenchen on 06/03/2017.
 */
const express = require('express');
const router = express.Router();
const orm = require('../../db/orm');
const db = require('../../db/db');
router.post("/list",function(req,res)
{
    let model={};
    orm.get("menu",{},{name:1},function(err,rs)
    {

    });
});
module.exports = router;