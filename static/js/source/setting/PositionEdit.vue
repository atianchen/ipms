<template>
 <div class="row">

  <div class="col-md-12 col-sm-12 col-xs-12">
   <div class="x_panel">
    <div class="x_title">
     <h2>Position Edit<small>Edit the position info</small></h2>
     <ul class="nav navbar-right panel_toolbox">

     </ul>
     <div class="clearfix"></div>
    </div>
    <div class="x_content">
     <br />
     <form  name="positionForm" id="positionForm"  class="form-horizontal form-label-left"   @submit.prevent="savePosition">

      <div class="form-group">
       <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Position Code<span class="required">*</span>
       </label>
       <div class="col-md-6 col-sm-6 col-xs-12">
        <input type="text"  v-model="position.code" id="code" name="code" required="required" class="form-control col-md-7 col-xs-12">
       </div>
      </div>

      <div class="form-group">
       <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
       </label>
       <div class="col-md-6 col-sm-6 col-xs-12">
        <input type="text"  v-model="position.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
        <span class="fa fa-user form-control-feedback right" aria-hidden="true"></span>
       </div>
      </div>

      <div class="form-group">
       <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Level<span class="required">*</span>
       </label>
       <div class="col-md-6 col-sm-6 col-xs-12">
        <input type="text"  v-model="position.level" id="level" name="level" required="required" class="form-control col-md-7 col-xs-12">
       </div>
      </div>

      <div class="form-group">
       <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">LevelRate<span class="required">*</span>
       </label>
       <div class="col-md-6 col-sm-6 col-xs-12">
        <input type="text"  v-model="position.levelRate"  required data-parsley-min="0.1" data-parsley-max="10" id="levelRate" name="level" required="required" class="form-control col-md-7 col-xs-12">
       </div>
      </div>

      <div class="form-group">
       <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">STD Cost<span class="required">*</span>
       </label>
       <div class="col-md-6 col-sm-6 col-xs-12">
        <input type="text"  v-model="position.cost"  required  id="cost" name="cost" required="required" class="form-control col-md-7 col-xs-12">
       </div>
      </div>

      <div class="form-group">
       <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Currency<span class="required">*</span>
       </label>
       <div class="col-md-6 col-sm-6 col-xs-12">
           <select   placeholder="Choose Currency" v-model="position.currency" id="currency" name="currency" class="form-control"  >
            <option value="">Choose..</option>
            <option v-for="item in currency"  :value="item.abbr">
             {{ item.abbr }}
            </option>
           </select>
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
      <input type="hidden" name="id" :value="position._id" v-if="method=='update'"/>
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
               currency:[],
                position:{},
                method:"new"
            }
        },
        created:function(){
            let _self = this;
            if (this.$route.params && this.$route.params.posId)
            {
                this.method="update";
            }
           $.post("/setting/position/get",(this.$route.params && this.$route.params.posId)?{id:this.$route.params.posId}:null).done((rs)=>{
                if (rs.data)
                 _self.position=rs.data;
                  _self.currency = rs.currency;
               }).fail(function(){});
        },
        mounted:function(){
            initFormValidate();
        },
        methods: {
            backList:function()
            {
                this.$router.push('/setting/positionList')
            },
            delRole:function()
            {
                let _self=this;
                confirmOper("Prompt","Confirm delete",function()
                {
                    $.post("/setting/position/del",{position:_self.position}).done((rs)=>{_self.method="new";_self.position={}; notify("Delete successfully","","success");}).fail(function(){})
                });
            },
            savePosition:function()
            {
                if (validateForm())
                {
                    let _self=this;
                    if (this.method=="new")
                        $.post("/setting/position/save",{position:this.position}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
                    else
                        $.post("/setting/position/update",{position:this.position}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
                }
            }
        }

    }
</script>

