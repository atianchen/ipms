<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Project Edit<small>Edit the project info</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="projForm" id="projForm" class="form-horizontal form-label-left"   @submit.prevent="saveProj">
                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contractId">Contract<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select  v-model="proj.contractId" id="contractId" name="proj_contractId" class="select2_single  form-control" required data-parsley-required-message="please choose contract">
                                        <option value="">Choose..</option>
                                        <option v-for="contract in contracts"  :value="contract._id">
                                            {{ contract.contractId }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="projectId">Project Id<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <label class="control-label">{{proj.projectId}}</label>
                                    <input type="hidden"  :value="proj.projectId" id="projectId" />
                                </div>
                            </div>
                        </div>
                        <div class="row">

                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Project Name<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="proj.name" id="name" name="name" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contractId">Type<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select  v-model="proj.type" id="type" name="type" class="form-control" required data-parsley-required-message="please choose type">
                                        <option value="">Choose..</option>
                                        <option v-for="mt in milestoneTypes"  :value="mt.name">
                                            {{ mt.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="module">Project Scope
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.projModules" id="module" name="module" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="projamt">Project Amount
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.projAmt" id="projamt" name="projamt" class="form-control">
                                </div>
                            </div>
                        </div>


                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="impM">Imp Manday
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.impManday" id="impM" name="impM" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="cusM">Cus Manday
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.cusManday" id="cusM" name="cusM" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                        <div class="form-group col-md-6 col-sm-6">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" >Planned Milestone<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <div class="btn-group" data-toggle="buttons">
                                    <template v-for="mileston in alterMilestones">
                                            <label class="btn btn-info active"  v-if="isChoosed(mileston.name)" @click="clickPlanMilestone(mileston.name,$event)">
                                                {{mileston.name}}
                                            </label>
                                            <label class="btn btn-info" v-else @click="clickPlanMilestone(mileston.name,$event)">
                                               {{mileston.name}}
                                            </label>
                                    </template>
                                </div>
                            </div>
                        </div>

                            <div class="form-group col-md-6 col-sm-6" v-if="contract!=null && contract.po!=null">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" >Contract ProcessOpen
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <div class="btn-group" data-toggle="buttons">
                                            <label class="control-label">
                                                {{contract.po.toFixed(2)}}%
                                            </label>
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div class="row">
                        <div class="form-group col-md-6 col-sm-6">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="completedMilestone">Completed Milestone
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <select   placeholder="Choose Completed Milestone" v-model="completedMilestone" id="completedMilestone" name="completedMilestone" class="form-control"  >
                                    <option value="">Choose..</option>
                                    <option v-for="milestone in planedMilestones"  :value="milestone">
                                        {{ milestone }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group col-md-6 col-sm-6 ">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="division">Division<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <select   placeholder="Choose Division" v-model="proj.division" id="division" name="division" class="form-control"  >
                                    <option value="">Choose..</option>
                                    <option v-for="item in divisions"  :value="item.code">
                                        {{ item.code }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="pmId">PM<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select  v-model="proj.pmId" id="pmId" name="pmId" class="form-control" required data-parsley-required-message="please choose pm">
                                        <option value="">Choose..</option>
                                        <option v-for="p in persons"  :value="p._id">
                                            {{ p.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="memberIds">Team Member<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select place  v-model="memberIds" id="memberIds" name="memberIds" class="form-control select2_multiple"  multiple="multiple">

                                        <option v-for="p in persons"  :value="p._id">
                                            {{ p.userId }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                         </div>


                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="accComAccrual">Acclumated Accrual
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.accComAccrual" id="accComAccrual" name="accComAccrual" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="yearStartAccrual">Accrual of Year Begining
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.yearStartAccrual" id="yearStartAccrual" name="yearStartAccrual" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="currentYearAccAccrual">Accumlated Accrual of Current Year
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.currentYearAccAccrual" id="currentYearAccAccrual" name="currentYearAccAccrual" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="yearDiffManday">Diff Manday Between YearStart and Milestone
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="proj.yearDiffManday" id="yearDiffManday" name="yearDiffManday" class="form-control">
                                </div>
                            </div>
                        </div>



                        <div class="row" v-if="proj && proj._id">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" >System Project Id<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <label class="control-label" >{{proj.sysProj}}</label>
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" >Task Id<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <label class="control-label" >{{proj.taskId}}</label>
                                </div>
                            </div>

                         </div>

                            <div class="row">
                                <div class="form-group col-md-6 col-sm-6 ">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" >Current Milestone<span class="required">*</span>
                                    </label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <label class="control-label" >{{proj.currentMilestone}}</label>
                                    </div>
                                </div>
                           </div>
                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>

                                <button type="button" v-if="method=='update'" class="btn btn-success" @click="finishProject" >Finish</button>
                                <button type="submit" v-if="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-if="method=='update'" class="btn btn-danger" @click="delProject" >Remove</button>
                                <button type="submit" v-if="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="proj._id" v-if="method=='update'"/>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
export default {
  data () {
    return {
        contract:null,
        contractMap:{},
        memberIds:[],
        choosedMilesone:{},
        planedMilestones:[],
        proj:{contractId:null,name:null,type:null,completedMilestone:null ,type:null},
        contracts:[],
        persons:[],
        milestones:[],
        alterMilestones:[],
        divisions:[],
        method:"new",
        contractId:null,
        milestoneTypes:[],
        milestoneMap:{},
        completedMilestone:null
    }
  },
  watch: {
      "proj.contractId": "setProjectId",
      "proj.type": "updateProjType",
      "proj.name": "setProjectId",
      "completedMilestone": "setCurrentMilestone"
  },
  created:function(){
     let _self=this;
    if (this.$route.params && this.$route.params.projId)
    {
        this.method="update";
    }
   $.post("/project/project/get",(this.$route.params && this.$route.params.projId)?{id:this.$route.params.projId}:{})
                .done((rs)=>{

                     _self.milestoneTypes = rs.milestoneTypes;

                    _self.divisions = rs.divisions;
                if (rs.data){
                    _self.proj=rs.data;
                    if (rs.data.memberIds)
                         _self.memberIds=rs.data.memberIds;
                    else
                        _self.memberIds = [];
                     if (!_self.proj || !_self.proj.type)
                        _self.proj.type = rs.milestoneTypes[0];//"Imp";

                    if (_self.proj.planedMilestones)
                    {
                        _self.planedMilestones = rs.data.planedMilestones;
                        _self.proj.planedMilestones.forEach((m)=>{
                            _self.choosedMilesone[m]=m;
                        });
                    }
                    else
                    {
                      _self.planedMilestones = [];
                    }
                    if (_self.proj.completedMilestone)
                        _self.completedMilestone=_self.proj.completedMilestone;
                }
                 _self.filterMilestone();
                _self.contracts=rs.contracts;
                rs.contracts.forEach((contract)=>{_self.contractMap[contract._id.toString()]=contract;});
                _self.persons=rs.persons;
                _self.milestones=rs.milestones;
                 rs.milestones.forEach((m)=>{_self.milestoneMap[m.name]=m;});
                if (_self.proj && _self.proj._id)
                {
                    _self.contract = _self.contractMap[_self.proj.contractId.toString()]
                }
                _self.setCurrentMilestone();
    }).fail(function(){});
  },
  mounted:function(){
    initFormValidate();
    initSelectUI(this);
  },
  methods: {
      setCurrentMilestone:function()
      {
          this.proj.completedMilestone = this.completedMilestone;
          if (this.planedMilestones && this.planedMilestones.length>0  )
          {
              if (this.proj.completedMilestone)
              {
                  let hasNext = false;
                  for (let i=0;i<this.planedMilestones.length;i++)
                  {
                      if (this.proj.completedMilestone==this.planedMilestones[i])
                      {
                          if (i<(this.planedMilestones.length-1))
                          {
                              hasNext = true;
                              this.proj.currentMilestone = this.planedMilestones[i+1];
                          }

                          break;
                      }
                  }
                  if (!hasNext)
                  {
                      this.proj.currentMilestone = null;
                  }
              }
              else
              {
                  this.proj.currentMilestone = this.planedMilestones[0];
              }
          }
          else
          {
              this.proj.currentMilestone = null;
          }
          this.setProjectId();
      },
        updateProjType:function()
        {
            let _self = this;
            for (let m in this.choosedMilesone)
            {
                if (_self.milestoneMap[m].type!=_self.proj.type)
                   {
                     _self.choosedMilesone={};
                     break;
                   }
            }
             this.setProjectId();
             this.filterMilestone();
             this.setPlanedMilestones();
        },
      filterMilestone:function()
      {
         this.alterMilestones.splice(0,this.alterMilestones.length);
        if (this.proj.type)
        {
            let _self = this;
            let t = this.proj.type;
            this.milestones.forEach(function(m)
            {
                if (m.type==t)
                  _self.alterMilestones.push(m);
            });
          //  this.$set(this.alterMilestones,cms)
        }
      },
       setProjectId:function()
       {
           if (this.proj.contractId && this.proj.name && this.proj.name.length>0)
           {
                this.proj.projectId =this.contractMap[this.proj.contractId].abbr+"-"+this.proj.name;
                 if (this.proj.type && this.proj.type.length>0)
                      this.proj.sysProj = this.proj.type+"-"+this.proj.projectId;
                else
                      this.proj.sysProj = "";
                if (this.proj.type && this.proj.type.length>0)
                   if (this.proj.currentMilestone)
                      this.proj.taskId = this.proj.type+"-"+this.proj.projectId+"-"+this.proj.currentMilestone;
                   else
                   {
                         this.proj.taskId =   this.proj.type + "-" + this.proj.projectId+"-";//+ "-" + p.currentMilestone;
                    }
                else
                      this.proj.taskId = "";
           }
           else
           {
            this.proj.projectId="";
            this.proj.sysProj = "";
           }


       },
      isChoosed:function(milestone)
      {
        return  this.choosedMilesone[milestone] && typeof (this.choosedMilesone[milestone])!="undefined" &&this.choosedMilesone[milestone]!=null;
      },
      clickPlanMilestone:function(milestone,event)
      {
          if ( this.choosedMilesone[milestone]) {
              delete this.choosedMilesone[milestone];
              this.choosedMilesone[milestone]=null;
             $(event.target).css({"background":"#31b0d5","border-color":"#269abc"});
              //this.choosedMilesone[milestone] = null;
          }
          else
          {
             this.choosedMilesone[milestone] = milestone;
             $(event.target).css({"background":"#1d748d","border-color":"#238ba9"});
          }
          this.setPlanedMilestones();
          event.stopPropagation();
      },
      setPlanedMilestones:function()
      {

        this.planedMilestones.splice(0,this.planedMilestones.length);
        let _self = this;
        this.milestones.forEach((m)=>{
            if (_self.choosedMilesone[m.name])
              {

                  _self.planedMilestones.push(m.name);
              }
        });
       this.proj.planedMilestones = this.planedMilestones;
      },
      backList:function()
      {
         this.$router.push('/project/projectList')
      },
      finishProject:function()
      {
               let _self=this;
        confirmOper("Prompt","Confirm Finishs",function()
        {
           $.post("/project/project/finish",{proj:_self.proj}).done((rs)=>{
                     notify("Operation successfully","","success");
                }).fail(function(){})
        });
      },
    delProject:function()
    {
        let _self=this;
        confirmOper("Prompt","Confirm delete",function()
        {
           $.post("/project/project/del",{proj:_self.proj}).done((rs)=>{
                     _self.method="new";
                     _self.proj={};
                     _self.memberIds=[];
                     $("#memberIds option:selected").removeAttr("selected");
                     notify("Delete successfully","","success");
                }).fail(function(){})
        });
    },
    saveProj:function()
    {
        if (validateForm())
        {
            let _self=this;
            this.proj.memberIds = $("#memberIds").val();
           this.setPlanedMilestones();
           if (this.method=="new")
            $.post("/project/project/save",{proj:this.proj}).done((rs)=>{
                 if (rs.err)
                {
                  notify("Saved Unsuccessful:"+rs.err,"","failure");
                 }
                else{
                _self.method="update"; notify("Saved successfully","","success");
                }
               }).fail(function(){})
            else
             $.post("/project/project/update",{proj:this.proj}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(e){})
        }
    }
  }

}
</script>
<style>
    .btn-info.active, .btn-info:active, .open>.dropdown-toggle.btn-info {background:#1d748d;border-color:#238ba9}
</style>

