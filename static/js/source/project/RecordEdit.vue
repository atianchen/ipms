<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Record Edit<small>edit entry record</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="roleForm" id="roleForm"  class="form-horizontal form-label-left"   @submit.prevent="saveRecord">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" >User Id
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <label class="control-label">{{record.person}}</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">SysProj</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <select  placeholder="Choose Task" v-model="record.sysProj" id="sysProj" name="record_sysProj" class="select2_single form-control"  required >

                                    <option v-for="proj in projs"  :value="proj.sysProj">
                                        {{ proj.sysProj }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Milestone</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <select   placeholder="Choose Completed Milestone" v-model="record.milestone" id="milestone" name="milestone" class="form-control"  >
                                    <option value="">Choose..</option>
                                    <option v-for="milestone in milestones"  :value="milestone">
                                        {{ milestone }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Period</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <select   placeholder="Choose Period" v-model="record.period" id="period" name="period" class="form-control"  >
                                    <option value="">Choose..</option>
                                    <option v-for="period in periods"  :value="period">
                                        {{ period }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Begin Date</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <input type="text" v-model="record.createDate" class="form-control  col-md-2"  id="createDate"  required placeholder="DD/MM/YYYY  HH:MM">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">End Date</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <input type="text" v-model="record.modifiedDate" class="form-control  col-md-2"  id="modifiedDate"  placeholder="DD/MM/YYYY  HH:MM">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Addr</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <input type="text"  v-model="record.addr" id="addr" name="addr" required="required" class="form-control">
                            </div>
                        </div>

                        <div class="form-group" >
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Cash</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <input type="number" 	data-parsley-type="number" v-model="record.cash" id="cash" name="cash"   class="form-control">
                                <span class="fa fa-money form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>
                        <div class="form-group" >
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Completed Milestone</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 ">
                                <select   placeholder="Choose Completed Milestone" v-model="record.completedMilestone" id="completedMilestone" name="completedMilestone" class="form-control"  >
                                    <option value="">Choose..</option>
                                    <option v-for="milestone in milestones"  :value="milestone">
                                        {{ milestone }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" >
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Desc</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 ">
                                <textarea id="desc" name="desc" v-model="record.desc" class="resizable_textarea form-control" style="overflow: hidden; word-wrap: break-word; resize: horizontal; "></textarea>

                            </div>
                        </div>
                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="button" class="btn btn-danger" @click="delRecord" >Remove</button>
                                <button type="submit" class="btn btn-primary" >Update</button>
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
        user:{},
        record:{},
        project:{},
        contract:{},
        milestones:[],
        method:"new",
        projs:[],
        periods:["AM","PM","OT"]
    }
  }, watch:{
        "record.sysProj":function() {
            let _self = this;
            $.post("/project/record/getPlanMilestones",{sysProj:this.record.sysProj})
                .done((rs)=>{
                    if (rs.proj && rs.proj.planedMilestones)
                        _self.milestones = rs.proj.planedMilestones;

                })
                .fail(function(e){
                    notify(e,"","Error");
                })
        }
    },
  created:function(){
    if (this.$route.params && this.$route.params.recordId)
    {
        var _self=this;
        this.method="update";
        $.post("/project/record/get",{id:this.$route.params.recordId}).done((rs)=>{
         _self.record=rs.data;_self.contract=rs.contract;
         _self.user = rs.user;_self.milestones = rs.milestones;
         _self.project = rs.project;
         _self.projs = rs.projs;
         if (_self.record.createDate)
             _self.record.createDate = moment(_self.record.createDate*1000).format("DD/MM/YYYY, H:mm");
        if (_self.record.modifiedDate)
            _self.record.modifiedDate = moment(_self.record.modifiedDate*1000).format("DD/MM/YYYY, H:mm");

        }).fail(function(){});

    }
  },
  mounted:function(){
    initFormValidate();
      initSelectUI(this);
  },
  methods: {
    showTime:function(data)
    {
     if (data && data!=null &&  data>0)
          return moment(data*1000).format("DD/MM/YYYY, H:mm:ss");
    },
      backList:function()
      {
        this.$router.push('/project/recordList')
      },
    delRecord:function()
    {
        let _self=this;
        confirmOper("Prompt","Confirm delete",function()
        {
                $.post("/project/record/del",{record:_self.record}).done((rs)=>{_self.method="new";_self.record={}; notify("Delete successfully","","success");}).fail(function(){})
        });
    },
    saveRecord:function()
    {
        if (validateForm())
        {
            let _self=this;
            $.post("/entry/updateEntry",{record:this.record}).done((rs)=>{_self.record={}; notify("Update successfully","","success");})
                .fail(function(e){
                    notify("Update Failure","","error");
                })

        }
    }
  }

}
</script>

