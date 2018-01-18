<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Milestone <small>Manage milestone</small></h2>
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
                        <button type="button" class="btn btn-primary" @click='createMilestone'>New</button>
                    </div>
                    <hy-gridPager :page="page"  v-on:paginationClick="pagination"></hy-gridPager>
                </div>
                <!--input-->
                <div class="row" v-show="method==='edit'||method==='new'">

                    <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="x_title">
                                <h2><small>Edit Milestone</small></h2>
                                <ul class="nav navbar-right panel_toolbox">

                                </ul>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">
                                <br />
                                <form  name="milestoneForm" id="milestoneForm"  class="form-horizontal form-label-left"   @submit.prevent="saveMilestone">

                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                                        </label>
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <input type="text"   v-model="milestone.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Type<span class="required">*</span>
                                        </label>
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <select   placeholder="Choose Type" v-model="milestone.type" id="type" name="type" class="form-control"  >
                                                <option value="">Choose..</option>
                                                <option v-for="item in types"  :value="item.name">
                                                    {{ item.name}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Seq<span class="required">*</span>
                                        </label>
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <input type="number"   v-model="milestone.seq" id="seq" name="seq" required="required" class="form-control col-md-7 col-xs-12"
                                                   data-parsley-type="integer" data-parsley-min="1" data-parsley-max="100"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Accum Progress<span class="required">*</span>
                                        </label>
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <input type="number"   v-model="milestone.pct" id="percentage" name="pct" required="required" class="form-control col-md-7 col-xs-12"
                                                   data-parsley-type="integer" data-parsley-min="1" data-parsley-max="100"/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="desc" class="control-label col-md-3 col-sm-3 col-xs-12">Desc</label>
                                        <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                            <textarea id="desc" name="desc" v-model="milestone.desc" class="resizable_textarea form-control" style="overflow: hidden; word-wrap: break-word; resize: horizontal; "></textarea>

                                        </div>
                                    </div>



                                    <div class="ln_solid"></div>
                                    <div class="form-group">
                                        <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                            <button type="button" class="btn" @click="cancelEdit">Cancel</button>
                                            <button type="submit" v-if="method=='new'" class="btn btn-primary" >Save</button>
                                            <button type="button" v-if="method=='edit'" class="btn btn-danger" @click="delMilestone" >Remove</button>
                                            <button type="submit" v-if="method=='edit'" class="btn btn-primary" >Update</button>
                                        </div>
                                    </div>
                                    <input type="hidden" name="id" :value="milestone._id" v-if="method=='update'"/>
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
import GridPager from '../ctrl/GridPager.vue'
import {util} from '../../dist/pageHelper.js'

export default {
  mounted:function(){
    initFormValidate();
  },
  data () {
    return {
      milestone:{},
      types:[],
      page:{},
      gridColumns: [{title:"Name",name:"name",click:"_id"},{title:"Pct(%)",name:"pct",click:"_id"},{title:"Type",name:"type"},{title:"Seq",name:"seq"},{title:"CreateDate",name:"createDate",type:"date",format:"DD/MM/YYYY"}],
      gridData:[],
      method:"view"
    }
  },
  created:function(){
        let _self=this;
        $.post("/setting/milestone/load").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){});
        $.post("/setting/milestonetype/getAll").done((rs)=>{_self.types=rs.data;}).fail(function(){})
  },
  methods: {
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },

            pageSearch:function()
            {
                let _self=this;
                $.post("/setting/milestone/load",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            },
          saveMilestone:function()
          {

                if (validateForm())
                {
                    console.log(this.milestone.pct)
                    let _self=this;
                    if (this.method=="new")
                      $.post("/setting/milestone/save",{milestone:this.milestone}).done((rs)=>{
                                 notify("Saved successfully","","success");
                                _self.milestone={};
                                console.log("data:"+rs.data)
                                _self.gridData.push(rs.data);
                                _self.method="view";
                               }).fail(function(){})
                    else
                      $.post("/setting/milestone/update",{milestone:this.milestone}).done((rs)=>{
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
        createMilestone:function(ev){this.milestone={};this.method="new"},
        cancelEdit:function(){
            this.milestone={};
            this.method="view";
        },
        delMilestone:function()
          {
            let _self=this;
            confirmOper("Prompt","Confirm delete",function()
            {
                    $.post("/setting/milestone/del",{role:_self.milestone}).done((rs)=>{
                        _self.method="view";
                      for (let [index, m] of _self.gridData.entries()) {
                            if (m._id==_self.milestone._id)
                            {
                               _self.gridData.splice(index, 1);break;
                            }
                          }
                        _self.method="view";_self.milestone={};
                        notify("Delete successfully","","success");
                    }).fail(function(){})
            });
          },
        itemClick: function (param) {
            if (param)
            {
                var _self=this;
                this.method="update";
                $.post("/setting/milestone/get",{id:param}).done((rs)=>{_self.milestone=rs.data;_self.method="edit";}).fail(function(){});
            }
         }
    },
    components: {
     'hy-grid': Grid,
        'hy-gridPager': GridPager
  }
}
</script>
