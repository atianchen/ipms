/**
 * Created by jensen on 2017/1/25.
 */
const moment = require('moment')
const timeutils = require('./util/timeutils');
const upeClient = require('./upe/upeClient').UpeClient;
function getProjId(taskId)
{
    if (taskId.indexOf("Pre-Sales")==0) {
        return taskId.substring(10, taskId.lastIndexOf("-"));
    }
    else {
        if (taskId.indexOf("-MM-")>0) {
            return taskId.substring(taskId.indexOf("-") + 1, taskId.lastIndexOf("-MM-"));
        }
        else
        {
            return taskId.substring(taskId.indexOf("-") + 1, taskId.lastIndexOf("-"));
        }
    }
}
/*let str = "Pre-Sales-KLDevelopment-HCM-R";
console.log(str.substring(10,str.lastIndexOf("-")));
let index = str.lastIndexOf("-");
if (index<str.length-1)
    console.log(str.substring(index+1));

console.log(moment().unix());*/
let m = moment("2017-3-22");
console.log(m.unix());

let str = "Maint-太阳城-HCM-Maint-MM-3";
console.log(getProjId(str))

