/**
 * Created by jensen on 2017/2/7.
 */
exports.convertToMap=function(ary,key)
{
    let rs = new Map();
    ary.forEach(function(item)
    {
        rs.set(item[key].toString(),item);
    });
    return rs;
}