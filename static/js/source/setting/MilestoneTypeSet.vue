<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>MilestoneType <small>Manage milestone's type</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">

                    <div class="table-responsive">
                        <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1" v-if="method==='view'">
                        <button type="button" class="btn btn-primary" @click='createMilestoneType'>New</button>
                    </div>
                </div>
                <!--input-->
                <div class="row" v-show="method==='edit'||method==='new'">

                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="x_title">
                            <h2><small>Edit Milestone Type</small></h2>
                            <ul class="nav navbar-right panel_toolbox">

                            </ul>
                            <div class="clearfix"></div>
                        </div>
                        <div class="x_content">
                            <br />
                            <form  name="milestoneForm" id="milestoneForm"  class="form-horizontal form-label-left"   @submit.prevent="saveMilestoneType">

                                <div class="form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                                    </label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <input type="text"   v-model="type.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="desc" class="control-label col-md-3 col-sm-3 col-xs-12">Desc</label>
                                    <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                        <textarea id="desc" name="desc" v-model="type.desc" class="resizable_textarea form-control" style="overflow: hidden; word-wrap: break-word; resize: horizontal; "></textarea>

                                    </div>
                                </div>



                                <div class="ln_solid"></div>
                                <div class="form-group">
                                    <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                        <button type="button" class="btn" @click="cancelEdit">Cancel</button>
                                        <button type="submit" v-if="method=='new'" class="btn btn-primary" >Save</button>
                                        <button type="button" v-if="method=='edit'" class="btn btn-danger" @click="delMilestoneType" >Remove</button>
                                        <button type="submit" v-if="method=='edit'" class="btn btn-primary" >Update</button>
                                    </div>
                                </div>
                                <input type="hidden" name="id" :value="type._id" v-if="method=='update'"/>
                            </form>
                        </div>
                    </div>

                </div>
                <!--end input-->
            </div>
        </div>
    </div>
</template>
<script>
import Grid from '../ctrl/Grid.vue'
import {util} from '../../dist/pageHelper.js'

export default {
  mounted:function(){
   // initFormValidate();
  },
  data () {
    return {
      type:{},
      gridColumns: [{title:"Name",name:"name",click:"_id"},{title:"CreateDate",name:"createDate",type:"date",format:"DD/MM/YYYY"}],
      gridData:[],
      method:"view"
    }
  },
  created:function(){
        let _self=this;
        $.post("/setting/milestonetype/load").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
  },
  methods: {
          saveMilestoneType:function()
          {
                if (this.type.name && this.type.name.length>0)
                {
                    let _self=this;
                    if (this.method=="new")
                      $.post("/setting/milestonetype/save",{type:this.type}).done((rs)=>{
                                 notify("Saved successfully","","success");
                                _self.type={};
                                _self.gridData.push(rs.data);
                                _self.method="view";
                               }).fail(function(err){})
                    else
                      $.post("/setting/milestonetype/update",{type:this.type}).done((rs)=>{
                          _self.method="view";
                          let up = rs.data;
                          for (let [index, m] of _self.gridData.entries()) {
                              if (m._id==up._id)
                              {
                                  _self.gridData.splice(index, 1, up);break;
                              }
                          }
                        notify("Updated successfully","","success");
                    }).fail(function(){})
                }
          },
        createMilestoneType:function(ev){this.type={};this.method="new"},
        cancelEdit:function(){
            this.type={};
            this.method="view";
        },
        delMilestoneType:function()
          {
            let _self=this;
            confirmOper("Prompt","Confirm delete",function()
            {
                    $.post("/setting/milestonetype/del",{type:_self.type}).done((rs)=>{
                        _self.method="view";
                      for (let [index, m] of _self.gridData.entries()) {
                            if (m._id==_self.type._id)
                            {
                               _self.gridData.splice(index, 1);break;
                            }
                          }
                        _self.method="view";_self.type={};
                        notify("Delete successfully","","success");
                    }).fail(function(){})
            });
          },
        itemClick: function (param) {
            if (param)
            {
                var _self=this;
                this.method="update";
                $.post("/setting/milestonetype/get",{id:param}).done((rs)=>{_self.type=rs.data;_self.method="edit";}).fail(function(){});
            }
         }
    },
    components: {
     'hy-grid': Grid
  }
}
</script>
