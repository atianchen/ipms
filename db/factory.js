/**
 * Created by jensen on 2017/1/13.
 */
const config = require('../ctx/config.js');
const types = require("./constants.js");
exports.getConnectUrl = (x)=>{
    let db = config.db;
    switch (x)
    {
        case types.dbType.MONGODB:{
            return  `mongodb://${db.user}:${db.pwd}@${db.server}:${db.port}/${db.db}?maxPoolSize=${db.poolSize}`;
        }
    }
}
