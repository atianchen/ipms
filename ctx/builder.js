/**
 * Created by jensen on 2017/1/13.
 */
exports.extend=function (Child, Parent) { var p = Parent.prototype; var c = Child.prototype; for (var i in p) {if(c[i])continue; c[i] = p[i]; } }
