/**
 * Created by jensen on 2018/2/7.
 */
const moment = require("moment");
const {YearWeek} = require('../domain/model');
require('../db/db').initdb();
const orm = require('../db/orm');
let startMonth = 0;
let yearSeq = 0;
let seq = 0;
let m = null;
const initYearData=(year)=>
{
    let start = moment({ y:year, M:startMonth, d:1});
    while (true) {
        if (start.year()>year)
        {
            orm.insert(m, function (err,rs) {
                console.log(moment(rs.startDate*1000).format("YYYY-MM-DD")+":"+moment(rs.endDate*1000).format("YYYY-MM-DD")+":"+rs.seq);
            });
            break;
        }
        if (m == null || start.day() == 1) {
            if (m != null) {
                orm.insert(m, function (err,rs) {
                    console.log(moment(rs.startDate*1000).format("YYYY-MM-DD")+":"+moment(rs.endDate*1000).format("YYYY-MM-DD")+":"+rs.seq);
                });
            }
            m = new YearWeek();
            m.seq = seq++;
            m.year = start.year();
            m.startDate = start.unix();
        }
        m.endDate = start.unix();
        start.add(1,"days");

    }
}
initYearData(2018);
