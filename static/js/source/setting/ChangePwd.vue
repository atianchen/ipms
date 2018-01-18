<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Reset Password<small>reset your password</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="pwdForm" id="pwdForm"  class="form-horizontal form-label-left"   @submit.prevent="changePwd">

                        <div class="form-group">
                            <label for="pwd" class="control-label col-md-3 col-sm-3 col-xs-12">New Password</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="pwd" v-model="pwd" class="form-control col-md-7 col-xs-12"
                                       type="password"   maxlength="20"	>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="repwd" class="control-label col-md-3 col-sm-3 col-xs-12">RePassword</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="repwd" name="erpwd" v-model="repwd" class="form-control col-md-7 col-xs-12"
                                       type="password"    maxlength="20"
                                       data-parsley-equalto="#pwd" required data-parsley-equalto-message="Entered passwords differ from the another!">
                            </div>
                        </div>



                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="submit" class="btn btn-primary" >Save</button>
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
       pwd:null,
       repwd: null
    }
  },
  mounted:function(){
    initFormValidate();
  },
  methods: {
    changePwd:function()
    {
        if (validateForm())
        {
            let _self=this;
            $.post("/project/person/savePwd",{pwd:_self.pwd}).done((rs)=>{_self.pwd=null;_self.repwd=null ;notify("Saved successfully","","success");}).fail(function(){})

          }
    }
  }

}
</script>

