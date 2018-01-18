<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Consultant Edit<small>Edit the consultant information</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="personForm" id="personForm"  class="form-horizontal form-label-left"   @submit.prevent="savePerson">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="userId">UserId <span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input v-model="person.userId" type="text" id="userId" required="required" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="person.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
                                <span class="fa fa-user form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Position</label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <select id="position" v-model="person.positionId" class="form-control" required data-parsley-required-message="please choose position">
                                    <option value="">Choose..</option>
                                    <option v-for="position in positions"  :value="position._id">
                                        {{ position.code }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="division">Division<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <select   placeholder="Choose Division" v-model="person.division" id="division" name="division" class="form-control"  >
                                    <option value="">Choose..</option>
                                    <option v-for="item in divisions"  :value="item.code">
                                        {{ item.code }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12">Role</label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <select id="role" v-model="person.role" class="form-control" required data-parsley-required-message="please choose role">
                                    <option value="">Choose..</option>
                                    <option v-for="role in roles"  :value="role.name">
                                        {{ role.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="mobile" class="control-label col-md-3 col-sm-3 col-xs-12">Mobile</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <input id="mobile" v-model="person.mobile" class="form-control col-md-7 col-xs-12" type="text" >
                                <span class="fa fa-phone form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email" class="control-label col-md-3 col-sm-3 col-xs-12">Email</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="email" v-model="person.email" class="form-control col-md-7 col-xs-12"
                                       type="email"    data-parsley-type="email">
                                <span class="fa fa-envelope form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="slack" class="control-label col-md-3 col-sm-3 col-xs-12">GroupName</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="groupName" v-model="person.groupName" class="form-control col-md-7 col-xs-12"
                                       type="text"   >
                            </div>
                        </div>
                        <div class="form-group" v-if="avatar!=null">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3  col-sm-offset-3 col-xs-offset-12">
                               <img :src="avatar" width="50" height="150" class="img-circle profile_img"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label  class="control-label col-md-3 col-sm-3 col-xs-12 ">Avatar</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 ">
                                <input type="button" id="upload-btn" class="btn btn-primary btn-large clearfix" value="Choose Avatar">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="divisions">Permissions
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <select place  v-model="chooseDivisions" id="divisions" name="divisions" class="form-control select2_multiple"  multiple="multiple">

                                    <option v-for="division in divisions"  :value="division.code">
                                        {{ division.code }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="slack" class="control-label col-md-3 col-sm-3 col-xs-12">Slack</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="slack" v-model="person.slack" class="form-control col-md-7 col-xs-12"
                                       type="text"   >
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="slack" class="control-label col-md-3 col-sm-3 col-xs-12">YonyouSpace MemberId</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="upeMemberId" v-model="person.upeMemberId" class="form-control col-md-7 col-xs-12"
                                       type="text"   >
                            </div>
                        </div>

                        <div class="form-group" v-if="!person._id && method=='new'">
                            <label for="pwd" class="control-label col-md-3 col-sm-3 col-xs-12">Password</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="pwd" v-model="pwd" class="form-control col-md-7 col-xs-12"
                                       type="password"   maxlength="8"	data-parsley-maxlength="8"  minlength="6"	data-parsley-minlength="6">
                            </div>
                        </div>

                        <div class="form-group" v-if="!person._id && method=='new'">
                            <label for="repwd" class="control-label col-md-3 col-sm-3 col-xs-12">RePassword</label>
                            <div class="col-md-6 col-sm-6 col-xs-12   has-feedback">
                                <input id="repwd" name="erpwd" class="form-control col-md-7 col-xs-12"
                                       type="password"    maxlength="8"	data-parsley-maxlength="8"  minlength="6"	data-parsley-minlength="6"
                                       data-parsley-equalto="#pwd" required data-parsley-equalto-message="Entered passwords differ from the another!">
                            </div>
                        </div>

                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-if="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-if="method=='update'" class="btn btn-danger" @click="delPerson" >Remove</button>
                                <button type="submit" v-if="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="person._id" v-if="method=='update'"/>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import moment from 'moment'
import fileUploader from '../../dist/simpleAjaxUploader.js';
export default {
  data () {
    return {
        pwd:"",
        avatar:null,
        person:{},
        roles:[],
        positions:[],
        chooseDivisions:[],
        divisions:[],
        method:"new"
    }
  },
  created:function(){
     let _self=this;
    if (this.$route.params && this.$route.params.personId)
    {
        this.method="update";
    }
   $.post("/project/person/get",(this.$route.params && this.$route.params.personId)?{id:this.$route.params.personId}:{})
                .done((rs)=>{if (rs.data)_self.person=rs.data;

                  if (_self.person.divisions)
                      _self.chooseDivisions=_self.person.divisions;
                _self.divisions=rs.divisions;_self.roles=rs.roles;_self.positions=rs.positions;if (_self.person.avatar)_self.avatar=_self.person.avatar;}).fail(function(){});
  },
  mounted:function(){
    initFormValidate();
      initSelectUI();
    let _self = this;
    let uploader = new fileUploader.SimpleUpload({
      button: 'upload-btn',
      url: '/project/uploadImg', // server side handlerxs
      responseType: 'json',
      name: 'uploadfile',
      multiple: false,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'], // for example, if we were uploading pics
      hoverClass: 'ui-state-hover',
      focusClass: 'ui-state-focus',
      disabledClass: 'ui-state-disabled',
      onComplete:   function(filename, response) {
          if (!response) {
            alert("Upload Failure")
          }
          else
          {
            _self.avatar = response.file;
            _self.person.avatar = response.file;
          }
        }
});
  },
  methods: {
      backList:function()
      {
        this.$router.push('/project/personList')
      },
    delPerson:function()
    {
        let _self=this;
        confirmOper("Prompt","Confirm delete",function()
        {
                $.post("/project/person/del",{person:_self.person}).done((rs)=>{_self.method="new";_self.person={}; notify("Delete successfully","","success");}).fail(function(){})
        });
    },
    savePerson:function()
    {
        if (validateForm())
        {
            let _self=this;
            this.person.divisions= $("#divisions").val();
            if (this.method=="new")
              $.post("/project/person/save",{person:this.person,pwd:this.pwd}).done((rs)=>{
              if (rs.err)
              {
                notify("Saved Unsuccessful:"+rs.err,"","failure");
              }
              else
                {
                    _self.method="update"; notify("Saved successfully","","success");
                }
              }).fail(function(){})
            else
              $.post("/project/person/update",{person:this.person}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
        }
    }
  }

}
</script>

