/**
 * Created by jensenchen on 21/03/2017.
 */
const xlsx = require("node-xlsx");
const  fs = require("fs");
const moment = require("moment")
function getVal(col,data)
{
    if (col.type && col.type=="date")
    {
        if (data[col.name])
            return moment(data[col.name]*1000).format(col.format);
        else
            return "";
    }
    else if (col.exp)
    {
        return col.exp(data);
    }
    else
    {
        let properties = col.name.split(".");
        let val = data;
        properties.forEach(function(p)
        {
            if (val)
                val = val[p];
            else
                val = null;
        });
        if  (val && Array.isArray(val) && col.join)
            return val.join(col.join);
        else
            return val;
    }
}
exports.exportXls = function(cols,data,opts)
{
    let output = [];
    let head = [];
    cols.forEach((col)=>{
        head.push(col.title);
    });
    output.push(head);
    data.forEach((item)=>
    {
        let row =[];
        cols.forEach((col)=>{
            row.push(getVal(col,item));
        });
        output.push(row);
    })
    var file = xlsx.build([{name: "worksheet", data: output}]); // Returns a buffer

    fs.writeFileSync(process.cwd()+opts.url, file, 'binary');
    return {path:process.cwd()+opts.url};
}