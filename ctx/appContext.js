/**
 * appContext
 * Created by jensenchen on 12/03/2017.
 */
const Constants = require('../ctx/constants').Constants;
exports.getLoginUser=function(req){
    return req.session[Constants.LOGIN_USER_KEY];
};