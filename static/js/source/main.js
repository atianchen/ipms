/**
 * Created by jensen on 2017/1/13.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './Home.vue'
import PersonGrid from './user/PersonGrid.vue'
import PersonEdit from './user/PersonEdit.vue'
import RoleGrid from './setting/RoleGrid.vue'
import RoleEdit from './setting/RoleEdit.vue'
import ContractGrid from './project/ContractGrid.vue'
import ContractEdit from './project/ContractEdit.vue'
import MilestoneSet from './setting/MilestoneSet.vue'
import ProjectGrid from './project/ProjectGrid.vue'
import ProjectEdit from './project/ProjectEdit.vue'
import ActionGrid from './setting/ActionGrid.vue'
import ActionEdit from './setting/ActionEdit.vue'
import RecordGrid from './project/RecordGrid.vue'
import RecordEdit from './project/RecordEdit.vue'
import RecordAdd from './project/RecordAdd.vue'
import ChangePwd from './setting/ChangePwd.vue'
import PositionGrid from './setting/PositionGrid.vue'
import PositionEdit from './setting/PositionEdit.vue'
import MilestoneRecord from './rpt/MilestoneRecord.vue'
import CurrencyGrid from './setting/CurrencyGrid.vue'
import CurrencyEdit from './setting/CurrencyEdit.vue'
import CashAccrualReport from './rpt/CashAccrualReport.vue'
import MenuGroupEdit from './setting/MenuGroupEdit.vue'
import MenuGroupGrid from './setting/MenuGroupGrid.vue'
import MenuEdit from './setting/MenuEdit.vue'
import MenuGrid from './setting/MenuGrid.vue'
import MilestoneTypeSet from './setting/MilestoneTypeSet.vue'
import DivisionGrid from './setting/DivisionGrid.vue'
import DivisionEdit from './setting/DivisionEdit.vue'
Vue.use(VueRouter);
const routes = [
    { path: '/', component: Home },
    { path: '/setting/changePwd',name:'changePwd', component: ChangePwd },
    { path: '/setting/actionList',name:'actionList', component: ActionGrid },
    { path: '/setting/actionAdd',name:'actionAdd', component: ActionEdit },
    { path: '/setting/actionEdit/:actionId',name:'actionEdit', component: ActionEdit },
    { path: '/setting/roleList',name:'roleList', component: RoleGrid },
    { path: '/setting/roleAdd',name:'roleAdd', component: RoleEdit },
    { path: '/setting/roleEdit/:roleId',name:'roleEdit', component: RoleEdit },

    { path: '/setting/positionList',name:'positionList', component: PositionGrid },
    { path: '/setting/positionAdd',name:'positionAdd', component: PositionEdit },
    { path: '/setting/positionEdit/:posId',name:'positionEdit', component: PositionEdit },

    { path: '/setting/currencyList',name:'currencyList', component: CurrencyGrid },
    { path: '/setting/currencyAdd',name:'currencyAdd', component: CurrencyEdit },
    { path: '/setting/currencyEdit/:posId',name:'currencyEdit', component: CurrencyEdit },

    { path: '/setting/menuGroupList',name:'menuGroupList', component: MenuGroupGrid },
    { path: '/setting/menuGroupAdd',name:'menuGroupAdd', component: MenuGroupEdit },
    { path: '/setting/menuGroupEdit/:groupId',name:'menuGroupEdit', component: MenuGroupEdit },

    { path: '/setting/menuList',name:'menuList', component:  MenuGrid },
    { path: '/setting/menuAdd',name:'menuAdd', component: MenuEdit },
    { path: '/setting/menuEdit/:menuId',name:'menuEdit', component: MenuEdit },

    { path: '/setting/divisionList',name:'divisionList', component:  DivisionGrid },
    { path: '/setting/divisionAdd',name:'divisionAdd', component: DivisionEdit },
    { path: '/setting/divisionAdd/:divisionId',name:'divisionEdit', component: DivisionEdit },

    { path: '/setting/milestoneSet',name:'milestoneSet', component: MilestoneSet },
    { path:'/setting/milestoneTypeSet',name:'milestoneTypeSet', component: MilestoneTypeSet },
    { path: '/project/personList',name:'personList', component: PersonGrid },
    { path: '/project/personAdd',name:'personAdd', component: PersonEdit },
    { path: '/project/personEdit/:personId',name:'personEdit', component: PersonEdit },
    { path: '/project/contractList',name:'contractList', component: ContractGrid },
    { path: '/project/contractAdd',name:'contractAdd', component: ContractEdit },
    { path: '/project/contractEdit/:contractId',name:'contractEdit', component: ContractEdit },
    { path: '/project/projectList',name:'projectList', component: ProjectGrid },
    { path: '/project/projectAdd',name:'projectAdd', component: ProjectEdit },
    { path: '/project/projectEdit/:projId',name:'projectEdit', component: ProjectEdit },
    { path: '/project/recordList',name:'recordList', component: RecordGrid },
    { path: '/project/recordAdd',name:'recordAdd', component: RecordAdd },
    { path: '/project/recordEdit/:recordId',name:'recordEdit', component: RecordEdit },

    { path: '/rpt/milestoneRecord',name:'milestoneRecord', component: MilestoneRecord },
    { path: '/rpt/cashAccrualReport',name:'cashAccrualReport', component: CashAccrualReport }
]

const router = new VueRouter({
   // mode: 'history',
    routes: routes
})

new Vue({
    el: '#pmo',
    router,
    mounted: function() {
      initUI();
    }
})