/**
 * Created by jensen on 2017/1/15.
 */
exports.util = {
    qfilter:function(q)
    {
        let rs = {};
        for (var p in q)
        {
            if (q[p] && q[p].length >0)
            {
                rs[p]=q[p];
            }
        }
        return rs;
    }
}
