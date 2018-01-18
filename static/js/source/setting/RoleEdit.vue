<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Role Edit<small>Edit the role information</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="roleForm" id="roleForm"  class="form-horizontal form-label-left"   @submit.prevent="saveRole">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="role.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
                                <span class="fa fa-user form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>

 <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="menuIds">Purview
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                 <select place  v-model="menuIds" id="menuIds" name="menuIds" class="form-control select2_multiple"  multiple="multiple">

                                                                       <option v-for="menu in menus"  :value="menu._id">
                                                                           {{ menu.name }}
                                                                       </option>
                                                                   </select>
                            </div>
                        </div>


                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="allowLogin">AllowLogin
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="checkbox" v-model="role.allowLogin" id="allowLogin" name="allowLogin" value="1"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="desc" class="control-label col-md-3 col-sm-3 col-xs-12">Desc</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <textarea id="desc" name="desc" v-model="role.desc" class="resizable_textarea form-control" style="overflow: hidden; word-wrap: break-word; resize: horizontal; "></textarea>

                            </div>
                        </div>



                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delRole" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="role._id" v-if="method=='update'"/>
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
        menuIds:[],
        role:{},
        menus:[],
        method:"new",
        allowLogin:0
    }
  },
  created:function(){
    if (this.$route.params && this.$route.params.roleId)
    {
        var _self=this;
        this.method="update";

    }
    $.post("/setting/role/get",{id:this.$route.params.roleId}).done((rs)=>{
        if (rs.data)
        {
            _self.role=rs.data;
            if (_self.role.menuIds)
              _self.menuIds=_self.role.menuIds;
        }
        _self.menus = rs.ms;
    }).fail(function(){});
  },
  mounted:function(){
    initFormValidate();
       initSelectUI();
  },
  methods: {
      backList:function()
      {
        this.$router.push('/setting/roleList')
      },
    delRole:function()
    {
        let _self=this;
        confirmOper("Prompt","Confirm delete",function()
        {
                $.post("/setting/role/del",{role:_self.role}).done((rs)=>{_self.method="new";_self.role={}; notify("Delete successfully","","success");}).fail(function(){})
        });
    },
    saveRole:function(){
        if (validateForm())
        {
            let _self=this;

            this.role.menuIds= $("#menuIds").val();
            if (this.method=="new")
              $.post("/setting/role/save",{role:this.role}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
            else
              $.post("/setting/role/update",{role:this.role}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
          }
    }
  }

}
</script>

