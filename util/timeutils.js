/**
 * Created by jensen on 2017/1/24.
 */
const moment = require("moment")
const mm = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
function getWeek(arg)
{
    let m = null;
    if (arg)
        m = moment(arg);
    else
        m = moment();
    let day = m.day();
    if (day==0 || day==6)
        m.subtract((day==0)?2:1,"days");
    day = m.day();
    if (day<3 && (m.date()+(5-day))>m.daysInMonth())
    {
        return {month:m.add(1,"months").month()+1,week:1};
    }
    else if (day>3 && (m.date()-(day-3))<=0)
    {
        m.subtract(1, 'months').date(m.daysInMonth());
        return getWeek(m);
    }
    else {
        /**
         * count first week day in current month
         */
        let fm = moment(m);
        fm.date(1);
        let fmday = fm.day();
        if (fmday==0 || fmday==6)
            fm.subtract((day==0)?2:1,"days");
        fmday = fm.day();
        if (fmday > 3) {
            fm.add((fmday == 0 ? 1 : 8 - fmday), 'days');
        }
        let startday = fm.date();
        let df = fmday-1;
        if (df<0)
            df = 0;
        df++;
        let week = Math.round((m.date() - startday+df) / 7);
        if ((week*7)< (m.date() - startday+df))
            week++;
        return {month:m.month()+1,week:week};
    }

}
exports.getMonthAb=function(month){
    return mm[month];
}
exports.getWeekInfo=function(arg)
{
   return  getWeek(arg);
}
exports.quantum = function(time)
{
    let hour = moment().hours();
    if (hour>=6 && hour<12)
        return "AM";
    else if (hour>=12 && hour<=19)
        return "PM";
    else
        return "OT";
};
exports.quantumTime = function(time)
{
    let m = moment();
    let hour = m.hours();
    if (hour>=6 && hour<12)
        return "AM "+m.format("h:mm");
    else if (hour>=12 && hour<=19)
        return "PM "+m.format("h:mm");
    else
        return "OT "+m.format("h:mm");
}