<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Action Edit<small>Edit the bot's action</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="roleForm" id="roleForm"  class="form-horizontal form-label-left"   @submit.prevent="saveAction">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="code">Code<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="action.code" id="code" name="code" required="required" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="code">
                               Options
                            </label>
                           <label>
                                <input type="checkbox"   id="authCheckbox" value="1" v-model="auth"/> Auth
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="desc" class="control-label col-md-3 col-sm-3 col-xs-12">Script<span class="required">*</span></label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <textarea id="script" name="script" v-model="action.script" class="resizable_textarea form-control" style="height:300px;overflow: scroll; word-wrap: break-word; resize: horizontal; "></textarea>

                            </div>
                        </div>
                        <div class="form-group">
                            <label for="desc" class="control-label col-md-3 col-sm-3 col-xs-12">Desc</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <textarea id="desc" name="desc" v-model="action.desc" class="resizable_textarea form-control" style="overflow: hidden; word-wrap: break-word; resize: horizontal; "></textarea>

                            </div>
                        </div>

                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delAction" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="action._id" v-if="method=='update'"/>
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
        action:{},
        method:"new"
    }
  },
  computed: { // "computed" instead of "compute"
    auth: {
      get: function() {
         if (this.$data.action.auth)
            return true;
         else
             return false;
      },
      set: function(val) {
          if (val)
            this.$data.action.auth = 1;
          else
            this.$data.action.auth = 0;
      },
    }
  },
  created:function(){
    if (this.$route.params && this.$route.params.actionId)
    {
        var _self=this;
        this.method="update";
        $.post("/setting/action/get",{id:this.$route.params.actionId}).done((rs)=>{_self.action=rs.data;}).fail(function(){});
    }
  },
  mounted:function(){
    initFormValidate();

    initForm();
    $(".js")
  },
  methods: {
      backList:function()
      {
        this.$router.push('/setting/actionList')
      },
    delAction:function()
    {
        let _self=this;
        confirmOper("Prompt","Confirm delete",function()
        {
                $.post("/setting/action/del",{action:_self.action}).done((rs)=>{_self.method="new";_self.action={}; notify("Delete successfully","","success");}).fail(function(){})
        });
    },
    saveAction:function()
    {
        if (validateForm())
        {
            let _self=this;
            if (this.method=="new")
              $.post("/setting/action/save",{action:this.action}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
            else
              $.post("/setting/action/update",{action:this.action}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
          }
    }
  }

}
</script>

