/**
 * File Upload
 * Created by jensen on 2017/2/20.
 */
const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const path = require("path");
router.post("/uploadImg",function(req,res)
{
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    form.uploadDir = "uploads/images/";
    //file size limits
    form.maxFilesSize = 2 * 1024 * 1024;

    form.parse(req, function(err, fields, rs) {
        if (err) {
            res.json({success: false});
        }
        else
        {
            let file = rs.uploadfile[0];
            res.json({success: true, file: "/uploads/images/" + path.basename(file.path)});
        }
    });

});
module.exports = router;