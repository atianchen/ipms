/**
 * Created by inc.courser on 2015/12/8.
 */
var moment = require('moment');
var {ObjectId} = require('mongodb');
exports.praseDate=function(t,format)
{
    return moment(t,format||"DD/MM/YYYY");
};
exports.containsQueryParam=function(req,key,name)
{
    return req.body[key] && req.body[key][name] && req.body[key][name].trim().length>0;
}
exports.formatDate=function(t,format)
{
    if (t)
       return moment(t).format(format||"DD/MM/YYYY");
    else
       return moment().format(format||"DD/MM/YYYY");
};
exports.mergeAjaxReq = function(req,params)
{
    return params;
};
exports.mergeReq=function(req,params)
{
    for (var property in  req.query) {
        if (typeof params[property] == "undefined" || !params[property])
            params[property] = req.query[property];
    }
    if (req.originalUrl)
    {
        params.url = req.originalUrl;
        if (params.url.indexOf("?")>0)
        {
            params.url = params.url.substring(0,params.url.indexOf("?"));
        }
    }
   // params.constants = domain.constants;
    params.moment = moment;
   //s loadMenu(req.baseUrl,params);
    return params;
};
exports.getPagination=function(req)
{
    /**
     * pn pagenumber
     * ps pagesize
     * @type {{pn: number, ps: number}}
     */
    var param = {pn:0,ps:10};
    if (req.query["pn"])
    {
        param["pn"]=parseInt(req.query["pn"]);
    }
    else if (req.body && req.body.page && req.body.page.pn)
        param["pn"]=parseInt(req.body.page.pn);
    if (req.query["ps"])
    {
        param["ps"]=parseInt(req.query["ps"]);
    }
    else  if (req.body && req.body.page && req.body.page.ps)
        param["ps"]=parseInt( req.body.page.ps);
    return param;
};
exports.appendPagerSql=function(sql,pagination)
{
    return sql+" limit "+(pagination.pn*pagination.ps)+","+((pagination.pn+1)*pagination.ps);
};
exports.mappingObj=function(req,data,entity,method)
{
    var fields = entity.getFieldDefin();
    for (var f in fields )
    {
        if (f=="createDate" && !entity["_id"])
        {
            entity[f]=moment().unix();
            entity["modifiedDate"]=entity[f];
        }
        else if (f=="modifiedDate" && entity["_id"])
        {
            entity[f]=moment().unix();
        }
       else  if (typeof data[f]!="undefined"  && data[f])
        {
            entity[f]=convertVal(data[f],fields[f].type,fields[f].format);
        }
    }
    if (entity["_id"] && typeof(entity["createDate"])=="undefined")
    {
        entity["createDate"] =  moment().unix();
        entity["modifiedDate"] = entity["createDate"];

    }
};
function convertVal(val,type,format)
{
    if (type=="int")
        return parseInt(val);
    else if (type=="float" || type=="double")
        return parseFloat(val);
    else if (type=="bool")
        return val;
    else if (type=="date")
        return moment(val,format).unix();
    else if (type=="ref")
        return new ObjectId(val);
    else if (type=="refset")
    {
        console.log(val);
        return  val.map(v => {
            return new ObjectId(v);
        });
    }
    else if (type=="array")
    {
        return val;
    }
    else if (val.length>0)
        return val;
    else return null;
}