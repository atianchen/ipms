/**
 * Created by jensen on 2018/1/27.
 */
import Vue from 'vue'
import Home from './Home.vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
const routes=[
    { path: '/', component: Home },
    { path: '/setting/changePwd',name:'changePwd', component: resolve=>require(["./setting/ChangePwd.vue"],resolve) },
    { path: '/setting/actionList',name:'actionList', component:  resolve=>require(["./setting/ActionGrid.vue"],resolve) },
    { path: '/setting/actionAdd',name:'actionAdd', component:  resolve=>require(["./setting/ActionEdit.vue"],resolve) },
    { path: '/setting/actionEdit/:actionId',name:'actionEdit', component:  resolve=>require(["./setting/ActionEdit.vue"],resolve) },
    { path: '/setting/roleList',name:'roleList', component:  resolve=>require(["./setting/RoleGrid.vue"],resolve) },
    { path: '/setting/roleAdd',name:'roleAdd', component:  resolve=>require(["./setting/RoleEdit.vue"],resolve) },
    { path: '/setting/roleEdit/:roleId',name:'roleEdit', component:  resolve=>require(["./setting/RoleEdit.vue"],resolve) },

    { path: '/setting/positionList',name:'positionList', component:  resolve=>require(["./setting/PositionGrid.vue"],resolve) },
    { path: '/setting/positionAdd',name:'positionAdd', component:  resolve=>require(["./setting/PositionEdit.vue"],resolve) },
    { path: '/setting/positionEdit/:posId',name:'positionEdit', component:  resolve=>require(["./setting/PositionEdit.vue"],resolve) },

    { path: '/setting/currencyList',name:'currencyList', component:  resolve=>require(["./setting/CurrencyGrid.vue"],resolve) },
    { path: '/setting/currencyAdd',name:'currencyAdd', component:  resolve=>require(["./setting/CurrencyEdit.vue"],resolve) },
    { path: '/setting/currencyEdit/:posId',name:'currencyEdit', component:  resolve=>require(["./setting/CurrencyEdit.vue"],resolve) },

    { path: '/setting/menuGroupList',name:'menuGroupList', component:  resolve=>require(["./setting/MenuGroupGrid.vue"],resolve) },
    { path: '/setting/menuGroupAdd',name:'menuGroupAdd', component:  resolve=>require(["./setting/MenuGroupEdit.vue"],resolve) },
    { path: '/setting/menuGroupEdit/:groupId',name:'menuGroupEdit', component:  resolve=>require(["./setting/MenuGroupEdit.vue"],resolve) },

    { path: '/setting/menuList',name:'menuList', component:   resolve=>require(["./setting/MenuGrid.vue"],resolve) },
    { path: '/setting/menuAdd',name:'menuAdd', component:  resolve=>require(["./setting/MenuEdit.vue"],resolve) },
    { path: '/setting/menuEdit/:menuId',name:'menuEdit', component:  resolve=>require(["./setting/MenuEdit.vue"],resolve) },

    { path: '/setting/divisionList',name:'divisionList', component:   resolve=>require(["./setting/DivisionGrid.vue"],resolve) },
    { path: '/setting/divisionAdd',name:'divisionAdd', component:  resolve=>require(["./setting/DivisionEdit.vue"],resolve) },
    { path: '/setting/divisionAdd/:divisionId',name:'divisionEdit', component:  resolve=>require(["./setting/DivisionEdit.vue"],resolve) },

    { path: '/setting/milestoneSet',name:'milestoneSet', component:  resolve=>require(["./setting/MilestoneSet.vue"],resolve) },
    { path:'/setting/milestoneTypeSet',name:'milestoneTypeSet', component:  resolve=>require(["./setting/MilestoneTypeSet.vue"],resolve) },
    { path: '/project/personList',name:'personList', component:  resolve=>require(["./user/PersonGrid.vue"],resolve) },
    { path: '/project/personAdd',name:'personAdd', component:  resolve=>require(["./user/PersonEdit.vue"],resolve) },
    { path: '/project/personEdit/:personId',name:'personEdit', component:  resolve=>require(["./user/PersonEdit.vue"],resolve) },
    { path: '/project/contractList',name:'contractList', component:  resolve=>require(["./project/ContractGrid.vue"],resolve) },
    { path: '/project/contractAdd',name:'contractAdd', component:  resolve=>require(["./project/ContractEdit.vue"],resolve) },
    { path: '/project/contractEdit/:contractId',name:'contractEdit', component:  resolve=>require(["./project/ContractEdit.vue"],resolve) },
    { path: '/project/projectList',name:'projectList', component:  resolve=>require(["./setting/PositionGrid.vue"],resolve) },
    { path: '/project/projectAdd',name:'projectAdd', component:  resolve=>require(["./setting/PositionEdit.vue"],resolve) },
    { path: '/project/projectEdit/:projId',name:'projectEdit', component:  resolve=>require(["./setting/PositionEdit.vue"],resolve) },
    { path: '/project/recordList',name:'recordList', component:  resolve=>require(["./project/RecordGrid.vue"],resolve) },
    { path: '/project/recordAdd',name:'recordAdd', component:  resolve=>require(["./project/RecordEdit.vue"],resolve) },
    { path: '/project/recordEdit/:recordId',name:'recordEdit', component:  resolve=>require(["./project/RecordEdit.vue"],resolve) },

    { path: '/rpt/milestoneRecord',name:'milestoneRecord', component:  resolve=>require(["./rpt/MilestoneRecord.vue"],resolve) },
    { path: '/rpt/cashAccrualReport',name:'cashAccrualReport', component:  resolve=>require(["./rpt/CashAccrualReport.vue"],resolve) }
];
export default new VueRouter({
    routes: routes
})
