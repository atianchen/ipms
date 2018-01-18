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
