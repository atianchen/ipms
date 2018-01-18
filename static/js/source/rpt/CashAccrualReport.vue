<template>
    <div class="grid">
        <div class="row qrbar">
            <ul>
                <li>
                    <div class="input-group">
                        <select   placeholder="Choose Year" v-model="year" id="year" name="year" class="form-control"  >
                            <option value="">Choose..</option>
                            <option v-for="item in years"  :value="item">
                                {{ item }}
                            </option>
                        </select>
                    </div>
                </li>
                <li>
                    <div class="input-group">
                        <select   placeholder="Choose Year" v-model="milestoneType" id="milestoneType" name="milestoneType" class="form-control"  >
                            <option v-for="item in milestoneTypes"  :value="item.name">
                                {{ item.name}}
                            </option>
                        </select>
                    </div>
                </li>
                <li>
                    <button type="button" class="btn btn-default" @click="yearStat">Stat</button>
                </li>
            </ul>
        </div>
        <table class="table table-bordered" id="rpt">
            <thead>
            <tr class="headings">
                <th rowspan="2">Imp</th>
                <th rowspan="2">CUS</th>
                <th rowspan="2" nowrap>Contract Id</th>
                <th rowspan="2" nowrap>签约年度</th>
                <th rowspan="2" nowrap>产品线</th>
                <th rowspan="2" nowrap>客户简称</th>
                <th rowspan="2" nowrap>Project Name</th>
                <th rowspan="2" nowrap>Project ID</th>
                <th rowspan="2" nowrap>Project Type</th>
                <th rowspan="2" nowrap>System ProjectID</th>
                <th rowspan="2">PM</th>
                <th rowspan="2" nowrap>币种</th>
                <th rowspan="2" nowrap>合同金额(不含税)</th>
                <th rowspan="2" nowrap>累积进度</th>
                <th colspan="14" nowrap>Cash-In</th>
                <th v-bind:colspan="milestones.length+2" nowrap>Accrual</th>
            </tr>
            <tr class="headings">
               <th>Opening(AR)</th>
                <th v-for="n in months">{{ getMonthName(n) }}</th>
                <th>Sum</th>
                <th>Opening(Progress)</th>
                <th v-for="m in milestones">{{ m.name }}</th>
                <th>Sum</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="project in projects">
                <tr>
                    <td>{{project.imp}}%</td>
                    <td>{{100-project.imp}}%</td>
                    <td>{{project.contractId}}</td>
                    <td>{{project.signedYear}}</td>
                    <td>{{project.productLine}}</td>
                    <td>{{project.customerAbbr}}</td>
                    <td>{{project.projName}}</td>
                    <td>{{project.projId}}</td>
                    <td>{{project.projType}}</td>
                    <td>{{project.sysProj}}</td>
                    <td>{{project.pm}}</td>
                    <td>{{project.currency}}</td>
                    <td>{{project.amt}}</td>
                    <td>{{project.cum}}%</td>
                    <td>{{project.cashInOpen}}</td>
                    <template v-for="m in months">
                        <td>{{project.monthCash[m-1]}}</td>
                    </template>
                    <td>{{project.monthSum}}</td>
                    <td>{{project.open}}%</td>
                    <template v-for="milestone in milestones">
                        <td>{{getProjMilestoneCash(project,milestone.name)}}</td>
                    </template>
                    <td>{{project.masum}}</td>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'
const mm = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export default {
  data () {
     return {
       projects:[],
       months:[],
       milestones:[],
       milestoneTypes:[],
       year:null,
       years:[],
       milestoneType:null
    }
  },
  created:function(){
      this.year = moment().format('YYYY');
      this.yearStat();
  },
  methods:{
    yearStat:function()
    {
         let _self = this;
      $.post("/rpt/cashAccrualReport",{year:this.year,milestoneType:this.milestoneType}).done((data)=>{
            try
            {
                _self.projects=data.rs;_self.milestones=data.milestones;
                _self.years = data.years;_self.year = data.year;
                _self.milestoneTypes= data.milestoneTypes;
                _self.milestoneType = data.milestoneType;
                for (let i=1;i<=12;i++)
                {
                    _self.months.push(i);
                }
            }catch (e)
            {
            }
        }).fail(function(){});
    },
    getMonthName:function(month)
    {
        return mm[month-1];
    },
    getProjMilestoneCash:function(project,milestone)
    {
        if (project.ma[milestone])
            return project.ma[milestone];
        else
             return "";
    }
  }
}
</script>
<style>
.table>thead>tr>th{text-align:center; vertical-align:middle}
</style>
