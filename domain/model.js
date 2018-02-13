/**
 * Created by jensen on 2017/1/13.
 */
const INT ="int";
const STRING = "string";
const DOUBLE = "double";
const DATE = "date";
const BOOL = "bool";
const FLOAT = "float";
const LONG = "long";
const REF = "ref";
const REFSET = "refset";
const ARRAY = "array";
class Entity
{

     assign(entity)
    {
        Object.assign(this,entity);
    }
}
class Position extends Entity{
    getFieldDefin()
    {
        return {
            name:{type:STRING,ai:true},
            code:{type:STRING},
            currency:{type:STRING},
            level:{type:STRING},
            levelRate:{type:DOUBLE},
            cost:{type:DOUBLE},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "position"};
}
class Role extends Entity
{
    getFieldDefin()
    {
        return {
            name:{type:STRING,ai:true},
            desc:{type:STRING,len:200},
            menuIds:{type:REFSET,join:{col:'menu'},alias:"menus"},
            allowLogin:{type:BOOL},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "role"};
}
class Person extends Entity{
    getFieldDefin()
    {
        return {
            userId:{type:STRING,ai:true},
            name:{type:STRING,len:200},
            role:{type:STRING},
            pwd:{type:STRING,len:200},
            positionId:{type:REF,join:{col:'position'},alias:"position"},
            lastProjId:{type:REF,join:{col:'lastProj'},alias:"project"},
            divisions:{type:ARRAY},
            division:{type:STRING},
            groupName:{type:STRING,len:200},
            avatar:{type:STRING,len:200},
            mobile:{type:STRING,len:200},
            email:{type:STRING,len:200},
            slack:{type:STRING,len:200},
            upeMemberId:{type:STRING,len:200},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "person"};
}
class  Contract extends Entity
{
    getFieldDefin()
    {
        return {
            contractId:{type:STRING,ai:true},
            signedYear:{type:INT,len:200},
            salesMan:{type:STRING},
            division:{type:STRING},
            productLine:{type:STRING,len:200},
            customerName:{type:STRING,len:200},
            customerAbbr:{type:STRING,len:200},
            currency:{type:STRING},
            amt:{type:DOUBLE},
            imp:{type:DOUBLE},
            cus:{type:DOUBLE},
            cashIn:{type:DOUBLE,len:200},
            cashInOpen:{type:DOUBLE},
            processOpen:{type:DOUBLE,len:200},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "contract"};
}
class MilestoneType extends Entity{
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            desc:{type:STRING},
            type:{type:STRING},
            pct :{type:INT},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "milestonetype"}
}
class Milestone extends Entity{
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            seq:{type:INT},
            desc:{type:STRING},
            type:{type:STRING},
            pct :{type:INT},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "milestone"}
}
class Project extends Entity
{
    /**
     * calcute progress
     */
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            projectId:{type:STRING},
            type:{type:STRING},
            sysProj:{type:STRING},
            taskId:{type:STRING},
            progress:{type:DOUBLE},
            division:{type:STRING},
            currentMilestone:{type:STRING},
            planedMilestones:{type:ARRAY},
            completedMilestone:{type:STRING},
            contractId:{type:REF,join:{col:'contract'},alias:"contract"},
            pmId:{type:REF,join:{col:'person'},alias:"pm"},
            memberIds:{type:REFSET,join:{col:'person'},alias:"members"},
            memberNames:{type:STRING},
            desc:{type:STRING},
            status:{type:INT},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "project"}
}
class Menu extends Entity
{
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            seq:{type:INT},
            groupId:{type:REF,join:{col:'menugroup'},alias:"group"},
            parentId:{type:REF,join:{col:'menu'},alias:"group"},
            link:{type:STRING},
            desc:{type:STRING},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "menu"}
}

/**
 * 菜单组
 */
class MenuGroup extends Entity{
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            seq:{type:INT},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "menugroup"}
}　
class Division extends Entity
{
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            code:{type:STRING},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "division"}
}
class Action extends Entity
{
    getFieldDefin()
    {
        return {
            code:{type:STRING},
            command:{type:STRING},
            script:{type:STRING},
            desc:{type:STRING},
            auth:{type:INT},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "action"}
}
class EntryRecord extends Entity{
    getFieldDefin()
    {
        return {
            taskId:{type:STRING},
            year:{type:INT},
            month:{type:INT},
            day:{type:INT},
            division:{type:STRING},
            sysProj:{type:STRING},
            period:{type:STRING},
            cash:{type:DOUBLE},
            addr:{type:STRING},
            milestone:{type:STRING},
            week:{type:INT},
            completedMilestone:{type:STRING},
            groupName:{type:STRING,len:200},
            weekMonth:{type:INT},
            type:{type:STRING},
            desc:{type:STRING},
            contractId:{type:REF,join:{col:'contract'},alias:"contract"},
            projId:{type:REF,join:{col:'project'},alias:"project"},
            person:{type:STRING},
            personName:{type:STRING},
            personId:{type:REF,join:{col:'person'},alias:"person"},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "entryrecord"}
}
class Currency
{
    getFieldDefin()
    {
        return {
            name:{type:STRING},
            abbr:{type:STRING},
            rate:{type:DOUBLE},
            createDate:{type:DATE,format:"DD/MM/YYYY"},
            createUser:{type:INT},
            modifiedUser:{type:INT},
            modifiedDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "currency"}
}
class AccessToken
{
    getFieldDefin()
    {
        return {
            token:{type:STRING},
            limitDate:{type:DATE,format:"DD/MM/YYYY"},
            createDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "accesstoken"}
}
class Calendar
{
    getFieldDefin()
    {
        return {
            year:{type:INT},
            month:{type:INT},
            date:{type :INT},
            fullDate:{type:DATE,format:"DD/MM/YYYY"},//yyyy-mm-dd
            monthweekId:{type:REF,join:{col:'monthweek'},alias:"monthweek"},// monthweek relation ,ManyToOne
            yearweekId:{type:REF,join:{col:'yearweek'},alias:"yearweek"},// yearweek relation ,ManyToOne
        };
    }
    getCollection(){return "calendar"}
}
/**
 * 年第几周
 */
class YearWeek
{
    getFieldDefin()
    {
        return {
            year:{type:INT},
            month:{type:INT},
            startDate:{type:DATE,format:"DD/MM/YYYY"},
            endDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "yearweek"}
}
/**
 * 月第几周
 */
class MonthWeek
{
    getFieldDefin()
    {
        return {
            year:{type:INT},
            month:{type:INT},
            startDate:{type:DATE,format:"DD/MM/YYYY"},
            endDate:{type:DATE,format:"DD/MM/YYYY"}
        };
    }
    getCollection(){return "monthweek"}
}
/**
 * 周收入预测
 */
class WeekCashForecast
{
    getFieldDefin()
    {
        return {
            monthweekId:{type:REF,join:{col:'monthweek'},alias:"monthweek"},// yearweek relation ,ManyToOne
            cash:{type:DOUBLE}
        };
    }
    getCollection(){return "weekcashforecast"}
}
/*
*周权责预测
 */
class WeekAccrualForecast
{
    getFieldDefin()
    {
        return{
            monthweekId:{type:REF,join:{col:'monthweek'},alias:"monthweek"},
            accrual:{type:DOUBLE}
        };
    }
    getCollection(){return "weekaccrualforecast"}
}
/**
 * 年收入预测
 */
class YearCashForecast
{
    getFieldDefin()
    {
        return {
            /*other properties*/
            weekcashSet:{type:REFSET,join:{col:'weekcashforecast'},alias:"weekcash"},
        };
    }
    getCollection(){return "yearcashforecast"}
}
/*
* 年权责预测
*/

class YearAccrualForecast
{
    getFieldDefin()
    {
        return{
            weekaccrualSet:{type:REFSET,join:{col:'weekaccrualforecast'},alias:'weekaccrual'},
        }
    };
    getCollection(){return "yearaccrualforecast"}
}
class ProjectStatus{
    getFieldDefin() {
        return {
            projectstatus: {type: STRING},
            abbr: {type: STRING}
        };
        }
        getCollection(){return "projectstatus"}

}

class CAInvoiceActual{
    getFieldDefin(){
        return {
            contractId: {type:REF, join:{col:'contract'},alias:'ContractId'},
            customer: {type:STRING},
            projectId:{type:REF,join:{col:'project'},alias:'ProjectId'},
            amount:{type:STRING},
            currency:{type:STRING},
            cash:{type:DOUBLE},
            cashindate:{type:DATE},
            completemilestone:{type:REF,join:{col:'milestone'},alias:'milestone'},
            confirmdate:{type:DATE},
            invoiceamount:{type:DOUBLE},
            invoicedate:{type:DATE}
        };
    }
    getCollection(){return "cainvoiceactual"}
}
class Cashinforecast{
    getFieldDefin(){
        return{
            entrysysdate: {type: DATE},
            contractId:{type:REF,join:{col:'contract'},alias:'ContractId'},
            customer:{type:STRING},
            projectId:{type:REF,join:{col:'project'},alias:'ProjectId'},
            amount:{type:DOUBLE},
            currency:{type:STRING},
            payment:{type:STRING},
            monthweek:{type:REFSET,join:{col:'MonthWeek'},alias:'monthweek'},
            weekcashforcast: {type:REFSET,join:{col:'weekcashforcast'},alias:'weekcash'}
        };
    }
    getCollection(){return "cashinforecast"}
}

class Accrualforecast{
    getFieldDefin(){
        return{
            entrysysdate:{type: DATE},
            projectId:{type:REF,join:{col:'project'},alias:'ProjectId'},
            customer:{type:STRING},
            contractId:{type:REF,join:{col:'contract'}},
            amount:{type:DOUBLE},
            currency:{type:STRING},
            currentmilestone:{type:STRING},
            monthweek:{type:REFSET,join:{col:'MonthWeek'},alias:'MonthWeek'},
            weekaccrualforecast:{type:REFSET,join:{col:'weekaccrualforecast'},alias:'weekaccrual'}
        };
    }
    getCollection(){return "accrualforecast"}
}

exports.Person = Person;
exports.Project = Project;
exports.Role = Role;
exports.Contract = Contract;
exports.Milestone = Milestone;
exports.MilestoneType = MilestoneType;
exports.Menu = Menu;
exports.MenuGroup = MenuGroup;
exports.Action = Action;
exports.EntryRecord = EntryRecord;
exports.Position = Position;
exports.Currency = Currency;
exports.AccessToken = AccessToken;
exports.Division = Division;
exports.ProjectStatus = Projectstatus;
exports.CAInvoiceactual = CaInvoiceactual;
exports.Cashinforecast = Cashinforecast;
exports.Accrualforecast = Accrualforecast;