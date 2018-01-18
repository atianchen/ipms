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
                        <select   placeholder="Choose MilestoneType" v-model="milestoneType" id="milestoneType" name="milestoneType" class="form-control"  >
                            <option value="">Choose..</option>
                            <option v-for="item in milestoneTypes"  :value="item.name">
                                {{ item.name }}
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
                    <th rowspan="2">ContractId</th>
                    <th rowspan="2">Accum Progress</th>
                    <th rowspan="2">Customer Name</th>
                    <th rowspan="2">Project Name</th>
                    <th rowspan="2">Project Id</th>
                    <th rowspan="2">PM</th>
                    <th v-bind:colspan="milestones.length" >Man-days by Milestone</th>
                    <th v-for="(month,index) in months"  rowspan="2">{{getMonthName(index)}}</th>
                </tr>
                <tr class="headings">
                    <th v-for="milestone in milestones" >{{milestone.name}}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="project in projects">
                    <tr>
                        <td>{{project.contractId}}</td>
                        <td>{{project.progress}}%</td>
                        <td>{{project.customerName}}</td>
                        <td>{{project.projectName}}</td>
                        <td>{{project.projectId}}</td>
                        <td>{{project.pm}}</td>
                        <template v-for="milestone in milestones">
                            <td>{{getProjMsManday(project,milestone)}}</td>
                        </template>
                        <template v-for="(month,index) in months">
                            <td>{{getProjMonthMilestone(project,index)}}</td>
                        </template>
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
       months:[1,2,3,4,5,6,7,8,9,10,11,12],
       milestones:[],
       year:null,
       years:[],
       milestoneTypes:[],
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
      $.post("/rpt/milestoneRpt",{year:this.year,milestoneType:this.milestoneType}).done((data)=>{
        _self.projects=data.rs;_self.milestones=data.milestones;_self.monthWeeks=data.mw;
        _self.years = data.years;_self.year = data.year;
        _self.milestoneTypes = data.milestoneTypes;
        _self.milestoneType = data.milestoneType;
        }).fail(function(){});
    },
    getMonthName:function(month)
    {
        return mm[month];
    },
    getProjMsManday:function(project,milestone)
    {
        if (project.ms && project.ms[milestone.name])
            return project.ms[milestone.name]*0.5;
         else
            return "";
    },
      getProjMonthMilestone:function(project,month)
    {
        if (project.ws[month.toString()] )
        {
            return project.ws[month.toString()].join(",");
        }
        else
         {
            return "";
         }
    }
  }
}
</script>
<style>
.table>thead>tr>th{text-align:center; vertical-align:middle}
</style>
