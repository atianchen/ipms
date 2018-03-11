<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>{{weekTitle}} WeekPlan Edit<small>Set the weekPlan</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="weekPlanForm" id="weekPlanForm"  class="form-horizontal form-label-left"   @submit.prevent="saveWeekPlan">
                        <table class="table table-striped jambo_table bulk_action  table-bordered">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>AM</td>
                                    <td>PM</td>
                                    <td>OT</td>
                                </tr>
                                <tr v-for="item in weeks" >
                                    <td>{{item.title}}</td>
                                    <td>
                                        <select  class="form-control"  v-model="plans[item.timestamp].am.projId" @change="switchProj(item.timestamp,'am')">
                                            <option value="">Choose TaskId...</option>
                                            <option v-for="proj in projs"  :value="proj._id">
                                                {{ proj.taskId }}
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <select  class="form-control" @change="switchProj(item.timestamp,'pm')"   v-model="plans[item.timestamp].pm.projId">
                                            <option value="">Choose TaskId...</option>
                                            <option v-for="proj in projs"  :value="proj._id">
                                                {{ proj.taskId}}
                                            </option>
                                         </select>
                                    </td>
                                    <td>
                                        <select  class="form-control" @change="switchProj(item.timestamp,'ot')"  v-model="plans[item.timestamp].ot.projId">
                                            <option value="">Choose TaskId...</option>
                                            <option v-for="proj in projs"  :value="proj._id">
                                                {{ proj.taskId }}
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" :disabled="executing">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        data () {
            return {
                yearWeek:{},
                weeks:[],
                milestoneMap:{},
                planList:[],
                plans:{},
                taskIdMap:{},
                projs:[],
                projMap:{},
                method:'new',
                executing:false,
                weekTitle:null,
                periods:["am","pm","ot"]
            }
        },
        mounted:function(){
            let _self = this;
            $.post("/im/getWeekPlan",{yearWeekId:this.$route.params.yearWeekId}).done((rs)=>{

                _self.yearWeek = rs.yearWeek;
                _self.projs = rs.projs;
                rs.projs.forEach((proj)=>{
                    _self.projMap[proj._id]=proj;
                });
                if (rs.plans)
                {
                    _self.planList = rs.plans;
                    rs.plans.forEach((plan)=>
                    {
                        if (_self.plans[plan.planDate]==null || typeof(_self.plans[plan.planDate])=="undefined")
                        {
                            _self.$set(_self.plans,plan.planDate,{});
                        }
                       // _self.$set(_self.plans,plan.planDate,plan);
                       // plan.taskId = plan.taskId;
                       _self.plans[plan.planDate][plan.period]=plan;
                    });
                }
                _self.init();
            }).fail(function(){});
        },
        methods: {
            init:function(){
                this.weekTitle =  moment(this.yearWeek.startDate*1000).format("MMMM")+"-WK"+(this.yearWeek.seq+1);
                let t = moment(this.yearWeek.startDate*1000);
                let endDate = moment(this.yearWeek.endDate*1000);
                while (t.unix()<=endDate.unix())
                {
                    this.weeks.push(
                        {
                            wt:t.unix(),
                            title:t.format("dddd"),
                            timestamp:t.unix()
                        }
                    );
                /*    this.plans[t.unix()]={
                        am:{projId:"",milestone:""},
                        pm:{projId:"",milestone:""},
                        ot:{projId:"",milestone:""}
                    };*/
                    this.fillPlan(t.unix());

                    //this.$set(this.milestoneMap ,t.unix()+"am",[]);
                    //this.$set(this.milestoneMap ,t.unix()+"pm",[]);
                    //this.$set(this.milestoneMap ,t.unix()+"ot",[]);

                    t.add(1,"days");
                }
                this.planList.forEach((plan)=>
                {
                    this.switchProj(plan.planDate,plan.period);
                });
            },
            fillPlan:function(time)
            {
                if (this.plans[time]==null || typeof(this.plans[time])=="undefined")
                {
                    this.plans[time] = {};
                }
                this.periods.forEach((period)=>
                {
                    if (this.plans[time][period]==null || typeof(this.plans[time][period])=="undefined")
                    {
                        this.plans[time][period] = {};
                    }});

               /* console.log("finish")

                this.plans[t.unix()]={
                    am:{projId:"",milestone:""},
                    pm:{projId:"",milestone:""},
                    ot:{projId:"",milestone:""}
                };*/
            },
            switchProj:function(time,period)
             {
               this.$set(this.milestoneMap ,time+period,this.projMap[this.plans[time][period].projId].planedMilestones);
            },
            backList:function()
            {
                this.$router.push({ name:'listWeekForPlan'})
            },
            saveWeekPlan:function()
            {
                let _self = this;
                for (let tk in this.plans)
                {
                    //console.log(tk)
                    for (let pk in this.plans[tk])
                    {
                        if (this.plans[tk][pk].projId) {
                            this.plans[tk][pk].taskId = this.projMap[this.plans[tk][pk].projId].taskId;
                            //console.log(this.projMap[this.plans[tk][pk].projId].taskId)
                        }
                    }
                }
                console.log(this.plans)
              $.post("/im/saveWeekPlan",{plans:this.plans,yearweekId:this.yearWeek._id}).done((rs)=>{
                    if (rs.err)
                    {
                        notify("Saved Unsuccessful:"+rs.err,"","failure");
                    }
                    else
                    {
                        notify("Saved Successful","","Successfual");
                    }
                    _self.executing = false;
                }).fail(function(e){_self.executing = false;})
            }
        }


    }
</script>
<style scoped>
    td.ld{width:15%;text-align:right;}
</style>